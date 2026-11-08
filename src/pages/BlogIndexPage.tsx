import React, { useState } from 'react';
import { Search, BookOpen, ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { BlogPost } from '../types';

interface BlogIndexPageProps {
  onNavigate: (path: string) => void;
  onSelectPost: (slug: string) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigate, onSelectPost }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tagsList = ['all', 'coding', 'chat', 'image', 'research', 'writing', 'general'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedTag !== 'all' && post.category !== selectedTag) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featuredPost = filteredPosts[0] || BLOG_POSTS[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
          <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
            Home
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 dark:text-white font-medium">Research &amp; Blog</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Engineering Benchmarks &amp; Editorial Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Original, non-sponsored investigations and comparative benchmarks designed to help developers, researchers, and creators make informed tool decisions.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {tagsList.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-[#2F5BFF] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tag === 'all' ? 'All Guides' : tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
          />
        </div>
      </div>

      {/* Featured Lead Post */}
      {featuredPost && (
        <div
          onClick={() => onSelectPost(featuredPost.slug)}
          className="group relative p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="max-w-3xl space-y-3">
            {/* Zero-Pill Unboxed Metadata */}
            <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#2F5BFF] uppercase tracking-wider text-[11px]">
                Featured Benchmark
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-slate-700 dark:text-slate-300">{featuredPost.category}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredPost.readTimeMinutes} min read</span>
              <span aria-hidden="true">·</span>
              <span>Published {featuredPost.date}</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors leading-snug">
              {featuredPost.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {featuredPost.description}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center">
                  {featuredPost.author.avatar}
                </div>
                <span>{featuredPost.author.name}</span>
              </div>
              <span>·</span>
              <span className="text-[#2F5BFF] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read Complete Evaluation
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post.slug)}
            className="group flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer hover:shadow-md"
          >
            <div>
              {/* Zero-Pill Unboxed Metadata */}
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">
                  {post.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{post.readTimeMinutes} min read</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#2F5BFF] transition-colors line-clamp-2 mb-2 leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {post.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>{post.author.name}</span>
              <span className="text-[#2F5BFF] font-semibold flex items-center gap-1">
                Read
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
