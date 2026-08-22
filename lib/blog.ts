import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  readingMinutes: number;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  content: string; // raw markdown
}

function slugFromFilename(filename: string): string {
  // strip leading "01-" ordering prefix and .md extension
  return filename.replace(/\.md$/, '').replace(/^\d+-/, '');
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(slugFromFilename);
}

function readAllRawPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
    const { data, content } = matter(raw);
    return {
      slug: slugFromFilename(filename),
      content,
      ...(data as BlogFrontmatter),
    };
  });
}

export function getAllPosts(): BlogPost[] {
  return readAllRawPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return readAllRawPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): string[] {
  const cats = new Set(getAllPosts().map((p) => p.category));
  return Array.from(cats);
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(markdown);
  return result.toString();
}

export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 1 : 0;
      const bScore = b.category === current.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

/**
 * Extract Q&A pairs from a post's "## Frequently asked questions" section
 * so it can be turned into real FAQPage schema, instead of just being
 * plain text search/AI engines have to parse out of prose themselves.
 *
 * Expected markdown shape (matches every post in content/blog today):
 *
 *   ## Frequently asked questions
 *
 *   **Question text?**
 *   Answer text, one paragraph.
 *
 *   **Next question?**
 *   Next answer.
 *
 * Returns [] if the post has no such section, or if it's not in this
 * shape — callers should treat an empty array as "no FAQ schema to add"
 * rather than an error.
 */
export function extractFaqFromContent(
  markdown: string
): { question: string; answer: string }[] {
  const sectionMatch = markdown.match(
    /^##\s+Frequently asked questions\s*$([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/im
  );
  if (!sectionMatch) return [];

  const section = sectionMatch[1];
  const qaPattern = /\*\*(.+?)\*\*\s*\n([^\n*][^\n]*(?:\n(?!\*\*|##)[^\n]+)*)/g;

  const results: { question: string; answer: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = qaPattern.exec(section)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\s+/g, ' ');
    if (question && answer) {
      results.push({ question, answer });
    }
  }
  return results;
}
