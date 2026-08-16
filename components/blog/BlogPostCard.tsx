import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';

export function BlogPostCard({ post }: { post: BlogPost }) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-lg border border-[#3c3934] bg-[#211f1c] p-5 transition-colors hover:border-[#81b64c]/60"
    >
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-[#81b64c]">
        <Tag className="h-3 w-3" />
        <span>{post.category}</span>
        <span className="text-zinc-600">•</span>
        <Clock className="h-3 w-3" />
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-zinc-100 leading-snug group-hover:text-[#81b64c] transition-colors">
        {post.title}
      </h3>
      <p className="mb-3 flex-1 text-sm text-zinc-400 leading-relaxed">
        {post.description}
      </p>
      <span className="text-xs text-zinc-500">{date}</span>
    </Link>
  );
}
