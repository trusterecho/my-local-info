import fs from "fs";
import path from "path";
import Link from "next/link";

import { DetailTemplate } from "@/components/DetailTemplate";

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

export async function generateStaticParams() {
  const data = await getLocalInfo();
  return data.events.map((event) => ({
    id: event.id,
  }));
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getLocalInfo();
  const event = data.events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 font-mono">
        <h1 className="text-4xl font-bold mb-4 animate-pulse">404 ERROR</h1>
        <p className="mb-8">데이터를 찾을 수 없습니다.</p>
        <Link href="/" className="px-6 py-2 border border-cyan-500 hover:bg-cyan-500 hover:text-slate-900 transition-colors">
          [목록으로 돌아가기]
        </Link>
      </div>
    );
  }

  return <DetailTemplate item={event} color="cyan" />;
}
