'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { Blog } from '@/data/blogsData';
import { resolvePublicImageSrc } from '@/lib/media';

export function BlogCard({ blog }: { blog: Blog }) {
  const imageSrc = resolvePublicImageSrc(blog.image) || blog.image;

  return (
    <Link href={`/blogs/${blog.slug}`} className="block h-full cursor-pointer group">
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-[24px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100"
      >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-secondary uppercase tracking-wide shadow-sm">
          {blog.category}
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col grow">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {blog.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {blog.readTime}</span>
        </div>
        
        <div className="group-hover:text-primary transition-colors mt-2">
          <h3 className="text-xl md:text-2xl font-bold font-heading text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6 grow leading-relaxed">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
            {blog.author}
          </div>
          <span className="text-secondary font-bold text-sm flex items-center gap-1 group-hover:underline">
            Read More <span className="text-lg leading-none">&rsaquo;</span>
          </span>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
