import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostData, getAllPostSlugs } from '@/lib/posts';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const postData = await getPostData(slug);
    return {
      title: `${postData.title} | 성남 생활 정보 블로그`,
      description: postData.summary,
    };
  } catch {
    return {
      title: '포스트를 찾을 수 없습니다',
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const postData = await getPostData(slug);

    return (
      <article className="container mx-auto px-4 py-16 max-w-3xl min-h-screen">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-orange-600 transition-colors mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          목록으로 돌아가기
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
            <time dateTime={postData.date}>{postData.date}</time>
            {postData.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <span className="text-orange-600 font-semibold uppercase tracking-wider text-xs">
                  {postData.category}
                </span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 leading-tight tracking-tight mb-6">
            {postData.title}
          </h1>
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {postData.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-orange-600 prose-img:rounded-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {postData.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-24 pt-8 border-t border-neutral-100">
          <div className="bg-neutral-50 rounded-2xl p-8 text-center">
            <p className="text-neutral-600 mb-4 font-medium">이 소식을 재미있게 읽으셨나요?</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-200"
            >
              성남 생활 정보 더 보기
            </Link>
          </div>
        </footer>
      </article>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}
