const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'local-info.json');

async function main() {
  try {
    const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!PUBLIC_DATA_API_KEY) throw new Error("PUBLIC_DATA_API_KEY is missing");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");

    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON`;
    
    // odcloud.kr 인증키는 보통 Authorization 헤더에 사용
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": PUBLIC_DATA_API_KEY
      }
    });

    if (!response.ok) {
        // Authorization 헤더가 실패할 경우 query 파라미터로 재시도
        const retryUrl = `${url}&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
        const retryResponse = await fetch(retryUrl);
        if (!retryResponse.ok) {
            throw new Error(`Public Data API failed: ${retryResponse.statusText}`);
        }
        var dataResponse = await retryResponse.json();
    } else {
        var dataResponse = await response.json();
    }

    const items = dataResponse.data || [];

    // 필터링 로직: 서비스명, 서비스목적요약, 지원대상, 소관기관명
    const checkKeyword = (item, keyword) => {
        const str = [
            item['서비스명'], 
            item['서비스목적요약'], 
            item['지원대상'], 
            item['소관기관명']
        ].join(' ');
        return str.includes(keyword);
    };

    let filteredItems = items.filter(item => checkKeyword(item, "성남"));
    
    if (filteredItems.length === 0) {
        filteredItems = items.filter(item => checkKeyword(item, "경기"));
    }

    if (filteredItems.length === 0) {
        filteredItems = items;
    }

    // [2단계] 기존 데이터와 비교
    let existingData = [];
    if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        existingData = JSON.parse(fileContent);
    }

    const existingNames = new Set(existingData.map(item => item.name));
    
    const newItems = filteredItems.filter(item => !existingNames.has(item['서비스명']));

    if (newItems.length === 0) {
        console.log("새로운 데이터가 없습니다");
        process.exit(0);
    }

    // 새 항목 1건 선택
    const targetItem = newItems[0];

    // [3단계] Gemini AI로 새 항목 가공
    const prompt = "아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:\n" +
                   "{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}\n" +
                   "category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.\n" +
                   "startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.\n" +
                   "반드시 JSON 객체만 출력해. 다른 텍스트 없이.\n\n" +
                   "데이터:\n" + JSON.stringify(targetItem, null, 2);

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!geminiRes.ok) throw new Error("Gemini API failed");

    const geminiData = await geminiRes.json();
    let responseText = geminiData.candidates[0].content.parts[0].text;

    // 마크다운 코드블록 제거
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const processedItem = JSON.parse(responseText);

    // ID 보정 (만약 id가 중복되거나 이상하면 새로 부여)
    processedItem.id = existingData.length > 0 ? Math.max(...existingData.map(d => d.id)) + 1 : 1;

    // [4단계] 기존 데이터에 추가
    existingData.push(processedItem);

    // 저장 공간 디렉토리 존재 확인
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log("새로운 데이터 추가 성공:", processedItem.name);

  } catch (error) {
    console.error("에러 발생:", error.message);
    process.exit(1);
  }
}

main();
