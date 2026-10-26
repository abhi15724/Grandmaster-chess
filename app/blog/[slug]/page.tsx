import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Tag, ChevronLeft } from 'lucide-react';
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  renderMarkdown,
  extractFaqFromContent,
} from '@/lib/blog';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import {
  jsonLdGraph,
  articleSchema,
  personSchema,
  breadcrumbSchema,
  faqSchema,
} from '@/lib/json-ld';
import { absoluteUrl, AUTHOR_URL_PATH } from '@/lib/site-config';
import { pageMetadata } from '@/lib/seo';

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

  const base = pageMetadata({
    noindex: post.noindex,
    title: post.seoTitle ?? post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    // Long post titles would be truncated once " | Grandmasterchess" is appended.
    absoluteTitle: (post.seoTitle ?? post.title).length > 40,
    ogLabel: post.category,
  });

  return {
    ...base,
    authors: [{ name: post.author }],
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      tags: post.tags,
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

  const faqs = extractFaqFromContent(post.content);

  const graph = jsonLdGraph(
    articleSchema(post),
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    ...(faqs.length > 0 ? [faqSchema(faqs)] : [])
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

      <div className="mb-8 space-y-1 text-xs text-zinc-500">
        <div className="flex flex-wrap items-center gap-x-2">
          <span>
            By{' '}
            <Link href={AUTHOR_URL_PATH} className="text-zinc-300 hover:text-[#81b64c] hover:underline">
              {post.author}
            </Link>
          </span>
          <span>•</span>
          <span>Published </span>
          <time dateTime={post.date}>{date}</time>
          {post.updated && post.updated !== post.date && (
            <>
              <span>•</span>
              <span>Updated </span>
              <time dateTime={post.updated}>
                {new Date(post.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </>
          )}
        </div>
        {post.factChecked && (
          <p>
            Facts and figures checked against the sources below on{' '}
            <time dateTime={post.factChecked}>
              {new Date(post.factChecked).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            . See our <Link href="/editorial-policy" className="underline hover:text-[#81b64c]">editorial policy</Link>.
          </p>
        )}
        {post.healthNotice && (
          <p className="rounded-md border border-[#3c3934] bg-[#1e1c19] p-2 text-zinc-400">
            This article is general information, not medical advice. If you are struggling with your mental health, please talk to a qualified professional.
          </p>
        )}
      </div>

      <article
        className="prose-chess"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {post.sources && post.sources.length > 0 && (
        <section className="mt-10 border-t border-[#3c3934] pt-6" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="mb-3 text-lg font-bold text-zinc-100">
            Sources and further reading
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            {post.sources.map((src) => (
              <li key={src.url}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[#81b64c] hover:underline">
                  {src.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

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
