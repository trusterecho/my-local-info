import Link from "next/link";

interface InfoItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

export function DetailTemplate({ item, color }: { item: InfoItem, color: "cyan" | "purple" }) {
  const isCyan = color === "cyan";
  const mainColorClass = isCyan ? "text-cyan-400" : "text-purple-400";
  const borderColorClass = isCyan ? "border-cyan-500/30" : "border-purple-500/30";
  const shadowClass = isCyan ? "shadow-[0_0_30px_rgba(34,211,238,0.2)]" : "shadow-[0_0_30px_rgba(168,85,247,0.2)]";
  const bgGradient = isCyan ? "from-cyan-500/10 to-transparent" : "from-purple-500/10 to-transparent";
  const buttonStyle = isCyan 
    ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
    : "bg-purple-500 text-white hover:bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]";

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-cyan-500 selection:text-white pb-20">
      {/* 상단 네비게이션 네온바 */}
      <nav className={`w-full h-1 bg-gradient-to-r ${isCyan ? 'from-cyan-400 to-blue-500' : 'from-purple-400 to-pink-500'}`}></nav>
      
      <main className="max-w-3xl mx-auto pt-16 px-6 relative">
        {/* 상단 카테고리 태그 및 날짜 (수정: 적당한 크기 + 깜빡이는 네온 점) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 font-mono pb-4 border-b border-slate-800/50">
          <span className={`inline-block px-4 py-1.5 text-sm font-bold border rounded bg-slate-900 shadow-md ${mainColorClass} ${borderColorClass} ${shadowClass}`}>
            [{item.category}]
          </span>
          <div className="flex items-center gap-2 text-sm md:text-base font-bold bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
             <span className={`w-2 h-2 rounded-full animate-pulse ${isCyan ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-purple-400 shadow-[0_0_8px_purple]'}`}></span>
             <span className="text-slate-300 tracking-wider">
               {item.startDate} {item.startDate !== item.endDate && <span className="text-slate-600 mx-1">~</span>} {item.startDate !== item.endDate && item.endDate}
             </span>
          </div>
        </div>

        {/* 메인 타이틀 */}
        <h1 className="text-4xl md:text-5xl font-black mb-10 text-white tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* 정보 요약 패널 */}
        <div className={`p-6 bg-slate-900/50 backdrop-blur-md rounded-xl border mb-12 flex flex-col gap-4 font-mono text-sm leading-relaxed relative overflow-hidden ${borderColorClass} ${shadowClass}`}>
          <div className="flex">
            <span className={`w-20 shrink-0 font-bold ${mainColorClass}`}>&gt; LOC:</span>
            <span className="text-slate-200">{item.location}</span>
          </div>
          <div className="flex">
            <span className={`w-20 shrink-0 font-bold ${mainColorClass}`}>&gt; TRG:</span>
            <span className="text-slate-200">{item.target}</span>
          </div>
          
          {/* 장식용 사이드 라인 */}
          <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${bgGradient}`}></div>
        </div>

        {/* 상세 설명 */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-3">
             <span className={`${mainColorClass}`}>//</span> SYSTEM.DETAILS
          </h2>
          <div className="text-slate-400 text-lg leading-loose font-light">
             <p className="whitespace-pre-wrap">{item.summary}</p>
             <p className="mt-6 italic text-slate-500">※ 이 페이지는 샘플 데이터로 구성되어 있습니다. 향후 공공데이터포털 API 연동 시 더 상세한 본문이 제공될 예정입니다.</p>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 font-mono font-bold uppercase tracking-widest text-sm">
          <a 
            href={item.link} 
            className={`flex-1 text-center py-4 rounded transition-all ${buttonStyle}`}
          >
            자세히 보기 &rarr;
          </a>
          <Link 
            href="/" 
            className={`flex-1 text-center py-4 rounded border bg-transparent hover:bg-slate-900 transition-all ${mainColorClass} ${borderColorClass}`}
          >
            목록으로 돌아가기
          </Link>
        </div>
        
      </main>
    </div>
  );
}
