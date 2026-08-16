import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { jsonLdGraph, breadcrumbSchema } from '@/lib/json-ld';

import { BLOG_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Chess Blog — Openings, Strategy & Guides',
  description:
    'Practical chess guides: openings for beginners, tactics like forks and pins, how to beat AI at every level, time control comparisons, and rules explained clearly.',
  keywords: BLOG_KEYWORDS,
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  const graph = jsonLdGraph(
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ])
  );

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-5 lg:px-6 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#81b64c]/40 bg-[#81b64c]/10 px-3 py-1 text-xs font-bold text-[#81b64c] mb-2.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Chess Blog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          Openings, Strategy & Guides
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Practical, no-fluff chess guides — from your first opening to beating advanced AI.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="/blog"
          className="rounded-full border border-[#81b64c]/60 bg-[#81b64c]/10 px-3 py-1.5 text-xs font-semibold text-[#81b64c]"
        >
          All Posts
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog/category/${encodeURIComponent(cat.toLowerCase())}`}
            className="rounded-full border border-[#3c3934] bg-[#211f1c] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-[#81b64c]/60 hover:text-[#81b64c] transition-colors"
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
