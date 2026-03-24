const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'local-info.json');
const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

async function main() {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");

    // [1단계] 최신 데이터 확인
    if (!fs.existsSync(DATA_FILE_PATH)) {
      throw new Error("local-info.json 파일이 존재하지 않습니다");
    }

    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);

    // events와 benefits를 합쳐서 마지막 항목 가져오기
    const allItems = [...(data.events || []), ...(data.benefits || [])];

    if (allItems.length === 0) {
      console.log("데이터가 없습니다");
      process.exit(0);
    }

    const latestItem = allItems[allItems.length - 1];

    // 기존 포스트 파일들과 비교 (title 기준)
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    const existingFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

    for (const file of existingFiles) {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      if (content.includes(latestItem.title)) {
        console.log("이미 작성된 글입니다");
        process.exit(0);
      }
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const today = new Date().toISOString().split('T')[0];

    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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
    responseText = responseText.replace(/```markdown/g, '').replace(/```/g, '').trim();

    // [3단계] FILENAME 줄 분리 및 파일 저장
    const lines = responseText.split('\n');
    let filename = `${today}-public-service`;
    let blogContent = '';

    // 마지막 줄에서 FILENAME 추출
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith('FILENAME:')) {
        filename = line.replace('FILENAME:', '').trim();
        // FILENAME 줄을 제거한 본문
        blogContent = lines.slice(0, i).join('\n').trim();
        break;
      }
    }

    // FILENAME을 못 찾은 경우 전체를 본문으로
    if (!blogContent) {
      blogContent = responseText.trim();
    }

    // 파일명 정리 (공백 제거, 소문자 변환)
    filename = filename.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    const filePath = path.join(POSTS_DIR, `${filename}.md`);

    // 같은 파일명이 이미 있으면 숫자 붙이기
    let finalPath = filePath;
    let counter = 2;
    while (fs.existsSync(finalPath)) {
      finalPath = path.join(POSTS_DIR, `${filename}-${counter}.md`);
      counter++;
    }

    fs.writeFileSync(finalPath, blogContent + '\n', 'utf-8');
    console.log("블로그 글 생성 성공:", path.basename(finalPath));

  } catch (error) {
    console.error("에러 발생:", error.message);
    process.exit(1);
  }
}

main();
