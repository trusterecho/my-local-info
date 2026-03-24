import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <header className="mb-12 border-b border-neutral-100 pb-8">
        <h1 className="text-4xl font-bold mb-4 text-neutral-900 tracking-tight">블로그</h1>
        <p className="text-lg text-neutral-600">성남의 다양한 소식과 삶의 이야기를 전해드립니다.</p>
      </header>

      <div className="space-y-12">
        {allPostsData.length > 0 ? (
          allPostsData.map(({ slug, date, title, summary, category }) => (
            <article key={slug} className="group flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-neutral-500 mb-1">
                <time dateTime={date}>{date}</time>
                {category && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                    <span className="text-orange-600 font-semibold uppercase tracking-wider text-xs">
                      {category}
                    </span>
                  </>
                )}
              </div>
              <Link href={`/blog/${slug}`} className="inline-block">
                <h2 className="text-2xl font-bold text-neutral-900 group-hover:text-orange-600 transition-colors duration-200">
                  {title}
                </h2>
              </Link>
              <p className="text-neutral-600 leading-relaxed max-w-2xl">
                {summary}
              </p>
              <div className="mt-2">
                <Link
                  href={`/blog/${slug}`}
                  className="text-sm font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 group/btn"
                >
                  더 읽어보기 
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-32 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-400 text-lg">아직 작성된 글이 없습니다.</p>
            <p className="text-neutral-400 text-sm mt-1">곧 새로운 소식으로 찾아뵙겠습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
