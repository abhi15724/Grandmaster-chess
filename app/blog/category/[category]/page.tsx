import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getAllCategories, getPostsByCategory } from '@/lib/blog';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

export function generateStaticParams() {
  return getAllCategories().map((cat) => ({ category: cat.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  if (posts.length === 0) return {};
  const label = posts[0].category;
  return {
    title: `${label} Articles — Chess Blog`,
    description: `Chess ${label.toLowerCase()} guides and articles from Grandmaster Chess Online.`,
    alternates: { canonical: `/blog/category/${category.toLowerCase()}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();
  const label = posts[0].category;

  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: label, path: `/blog/category/${category}` },
    ])
  );

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-5 lg:px-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#81b64c] transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        All Posts
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
        {label} Articles
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
