"use client"

import { Modal } from "@/components/ui/Modal"
import { BlogPost } from "@/types/api"
import { Calendar, Eye, User, Tag, Clock } from "lucide-react"

interface ViewBlogModalProps {
  post: BlogPost
  isOpen: boolean
  onClose: () => void
}

export function ViewBlogModal({ post, isOpen, onClose }: ViewBlogModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="5xl">
      <div className="p-6 space-y-6">
        {/* Title */}
        <div className="border-b dark:border-slate-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Yazısı Detayları
          </h2>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-slate-400 text-lg mb-3">
            {post.excerpt}
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            Slug: <span className="font-mono">{post.slug}</span>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Yazar</span>
            </div>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {post.author}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <span className="text-sm font-medium">Durum</span>
            </div>
            <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
              {post.status === 'published' ? 'Yayında' : post.status === 'draft' ? 'Taslak' : 'Arşiv'}
            </p>
          </div>
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
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg max-h-96 overflow-y-auto">
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
