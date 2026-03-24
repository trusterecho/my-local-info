import fs from "fs";
import path from "path";
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

interface LocalInfo {
  events: InfoItem[];
  benefits: InfoItem[];
  lastUpdated: string;
}

async function getLocalInfo(): Promise<LocalInfo> {
  const filePath = path.join(process.cwd(), "public/data/local-info.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function Home() {
  const data = await getLocalInfo();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-cyan-500 selection:text-white">
      {/* 1. 상단 헤더 (다이내믹 사이버펑크 스타일) */}
      <header className="relative bg-slate-950 overflow-hidden border-b border-cyan-500/50 py-20 px-6 shadow-[0_0_50px_-10px_rgba(34,211,238,0.3)] text-center cursor-default">
        {/* 다이내믹 네온 배경 효과 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[200%] bg-cyan-500/15 rotate-12 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
          <div className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[150%] bg-purple-600/20 -rotate-12 blur-[100px] rounded-full mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center pt-4 pb-0">
          <div className="inline-block relative mb-4 group">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] tracking-tight group-hover:scale-105 transition-transform duration-500 ease-out">
               NEON <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">성남</span>
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)] group-hover:w-[120%] transition-all duration-700 ease-in-out"></div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-slate-200 mt-2 mb-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] tracking-wide">
            우리 동네 생활 정보 허브 🚀
          </h2>
          
          <p className="text-cyan-400/90 text-xs md:text-sm font-mono tracking-[0.2em] uppercase bg-black/60 px-6 py-3 rounded-full border border-cyan-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping mr-3 align-middle"></span>
            System Online: Fetching Local Data...
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* 2. 이번 달 행사/축제 목록 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 border-l-4 border-cyan-400 pl-4 py-1 bg-gradient-to-r from-cyan-500/10 to-transparent">
            <span className="text-2xl animate-pulse">⚡</span>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
              [SYSTEM.EVENTS] 이번 달 행사
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.events.map((event) => (
              <Card key={event.id} item={event} type="event" />
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 목록 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 border-l-4 border-purple-400 pl-4 py-1 bg-gradient-to-r from-purple-500/10 to-transparent">
            <span className="text-2xl animate-pulse">💎</span>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
              [SYSTEM.FUNDS] 지원금 및 혜택
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.benefits.map((benefit) => (
              <Card key={benefit.id} item={benefit} type="benefit" />
            ))}
          </div>
        </section>
      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6 mt-auto">
        <div className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs">
          <div className="text-slate-500">
            <p className="mb-1">DATA_SOURCE: api.data.go.kr</p>
            <p>COPYRIGHT © 2026. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="bg-black/50 px-4 py-2 rounded border border-slate-700 text-cyan-500 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
            <span className="animate-pulse mr-2">●</span>
            LAST_SYNC: {data.lastUpdated}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ item, type }: { item: InfoItem; type: "event" | "benefit" }) {
  const isEvent = type === "event";
  
  // 행사(Event)는 Cyan 계열, 혜택(Benefit)은 Purple 계열
  const colorTheme = isEvent 
    ? "border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
    : "border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]";
  
  const tagTheme = isEvent
    ? "bg-cyan-950 text-cyan-400 border border-cyan-500/50"
    : "bg-purple-950 text-purple-400 border border-purple-500/50";
    
  const buttonTheme = isEvent
    ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
    : "bg-purple-500/10 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]";

  return (
    <div className={`group flex flex-col p-6 pt-8 rounded-xl border bg-slate-900/50 backdrop-blur-sm transition-all duration-300 relative overflow-hidden ${colorTheme}`}>
      
      {/* 카드 상단 장식선 */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 ${isEvent ? 'from-cyan-400 to-blue-500' : 'from-purple-400 to-pink-500'}`}></div>

      <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-3 mb-6 relative z-10 w-full">
        {/* 태그 부분: 단어 쪼개짐 방지 shrink-0 whitespace-nowrap 추가 */}
        <span className={`inline-block px-3 py-1 text-xs font-mono font-bold tracking-wider shrink-0 whitespace-nowrap ${tagTheme}`}>
          <span className="mr-1">[{item.category}]</span>
        </span>
        
        {/* 날짜 강조: 단어 쪼개짐 방지 및 크기 조절 */}
        <div className="flex items-center gap-2 text-[11px] xl:text-xs font-mono bg-slate-950/80 px-2 py-1.5 rounded border border-slate-800 break-keep">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${isEvent ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-purple-400 shadow-[0_0_8px_purple]'}`}></span>
          <span className="text-slate-300 tracking-wider">
            {item.startDate} {item.startDate !== item.endDate && <span className="text-slate-600 mx-1">~</span>} {item.startDate !== item.endDate && item.endDate}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-white transition-colors relative z-10">
        {item.title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed relative z-10 font-light">
        {item.summary}
      </p>

      <div className="mt-auto space-y-3 relative z-10 bg-black/30 p-3 rounded border border-slate-800/50">
        <div className="flex items-center gap-2 text-xs text-slate-300">
           <span className={`font-mono font-bold w-12 shrink-0 ${isEvent ? 'text-cyan-400' : 'text-purple-400'}`}>&gt; LOC:</span>
          <span className="truncate">{item.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
           <span className={`font-mono font-bold w-12 shrink-0 ${isEvent ? 'text-cyan-400' : 'text-purple-400'}`}>&gt; TRG:</span>
          <span className="truncate">{item.target}</span>
        </div>
      </div>

      <Link 
        href="/blog"
        className={`mt-6 block text-center py-3 border font-mono text-sm tracking-widest transition-all relative z-10 uppercase ${buttonTheme}`}
      >
        Access Data
      </Link>

      
      {/* 백그라운드 빛 효과 (Hover시 활성화) */}
      <div className={`absolute -bottom-20 -right-20 w-40 h-40 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-full ${isEvent ? 'bg-cyan-500' : 'bg-purple-500'}`}></div>
    </div>
  );
}
