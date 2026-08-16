import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Tag, ChevronLeft } from 'lucide-react';
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  renderMarkdown,
} from '@/lib/blog';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { jsonLdGraph, articleSchema, breadcrumbSchema } from '@/lib/json-ld';
import { absoluteUrl } from '@/lib/site-config';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);
  const related = getRelatedPosts(post);

  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const graph = jsonLdGraph(
    articleSchema(post),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ])
  );

  return (
    <div className="mx-auto max-w-3xl px-3 py-8 sm:px-5 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-[#81b64c] transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Blog
      </Link>

      <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold text-[#81b64c]">
        <Tag className="h-3 w-3" />
        <Link
          href={`/blog/category/${post.category.toLowerCase()}`}
          className="hover:underline"
        >
          {post.category}
        </Link>
        <span className="text-zinc-600">•</span>
        <Clock className="h-3 w-3" />
        <span>{post.readingMinutes} min read</span>
      </div>

      <h1 className="mb-3 text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight leading-tight">
        {post.title}
      </h1>

      <div className="mb-8 flex items-center gap-2 text-xs text-zinc-500">
        <span>{post.author}</span>
        <span>•</span>
        <time dateTime={post.date}>{date}</time>
      </div>

      <article
        className="prose-chess"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {related.length > 0 && (
        <div className="mt-12 border-t border-[#3c3934] pt-8">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">
            Related Reading
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <BlogPostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
