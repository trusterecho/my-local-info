import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

export function getSortedPostsData(): PostData[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Handle Date object to YYYY-MM-DD string
      let date = data.date;
      if (date instanceof Date) {
        date = date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
        // Ensure string dates are also formatted or handled
        date = date.split('T')[0];
      }

      return {
        slug,
        title: data.title || '',
        date: date || '',
        summary: data.summary || '',
        category: data.category || '',
        tags: data.tags || [],
        content,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        slug: fileName.replace(/\.md$/, ''),
      };
    });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let date = data.date;
  if (date instanceof Date) {
    date = date.toISOString().split('T')[0];
  } else if (typeof date === 'string') {
    date = date.split('T')[0];
  }

  return {
    slug,
    title: data.title || '',
    date: date || '',
    summary: data.summary || '',
    category: data.category || '',
    tags: data.tags || [],
    content,
  };
}
