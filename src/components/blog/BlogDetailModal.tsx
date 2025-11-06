"use client"

import { Modal } from "@/components/ui/Modal"
import { BlogPost } from "@/types/api"
import { User, Tag } from "lucide-react"

interface BlogDetailModalProps {
  post: BlogPost | null
  isOpen: boolean
  onClose: () => void
}

export function BlogDetailModal({ post, isOpen, onClose }: BlogDetailModalProps) {
  if (!post) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="5xl">
      <div className="p-6 space-y-6">
        {/* Title */}
        <div className="border-b dark:border-slate-700 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {post.title}
          </h2>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div>
            <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            post.status === 'published'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
          }`}>
            {post.status === 'published' ? 'Yayında' : 'Taslak'}
          </span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Etiketler
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            İçerik
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </Modal>
  )
}
