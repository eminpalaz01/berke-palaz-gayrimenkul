"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Building, 
  BarChart3, 
  Users, 
  Settings,
  Search,
  Filter,
  Loader2,
  LogOut
} from "lucide-react"
import { listingsApi, blogApi, statsApi } from "@/lib/api-client"
import { Listing, BlogPost, DashboardStats, UpdateListingDto, UpdateBlogPostDto, CreateListingDto, CreateBlogPostDto } from "@/types/api"
import toast from "react-hot-toast"
import { EditListingModal } from "./EditListingModal"
import { EditBlogModal } from "./EditBlogModal"
import { AddListingModal } from "./AddListingModal"
import { AddBlogModal } from "./AddBlogModal"
import { ViewListingModal } from "./ViewListingModal"
import { ViewBlogModal } from "./ViewBlogModal"

interface AdminPageProps {
  onLogout?: () => void
}

export function AdminPage({ onLogout }: AdminPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Data states
  const [listings, setListings] = useState<Listing[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)

  // Modal states
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null)
  const [viewingListing, setViewingListing] = useState<Listing | null>(null)
  const [viewingBlogPost, setViewingBlogPost] = useState<BlogPost | null>(null)
  const [showAddListing, setShowAddListing] = useState(false)
  const [showAddBlog, setShowAddBlog] = useState(false)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "listings", label: "İlanlar", icon: Building },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "users", label: "Kullanıcılar", icon: Users },
    { id: "settings", label: "Ayarlar", icon: Settings }
  ]

  // Fetch dashboard stats
  const fetchStats = async () => {
    setLoading(true)
    const response = await statsApi.getDashboard()
    if (response.success && response.data) {
      setStats(response.data)
    } else {
      toast.error(response.error || 'İstatistikler yüklenemedi')
    }
    setLoading(false)
  }

  // Fetch listings
  const fetchListings = async () => {
    setLoading(true)
    const response = await listingsApi.getAll({ search: searchTerm })
    if (response.success && response.data) {
      setListings(response.data)
    } else {
      toast.error(response.error || 'İlanlar yüklenemedi')
    }
    setLoading(false)
  }

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoading(true)
    const response = await blogApi.getAll({ search: searchTerm })
    if (response.success && response.data) {
      setBlogPosts(response.data)
    } else {
      toast.error(response.error || 'Blog yazıları yüklenemedi')
    }
    setLoading(false)
  }

  // Delete listing
  const handleDeleteListing = async (id: string) => {
    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return

    const response = await listingsApi.delete(id)
    if (response.success) {
      toast.success('İlan başarıyla silindi')
      fetchListings()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'İlan silinemedi')
    }
  }

  // Delete blog post
  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

    const response = await blogApi.delete(id)
    if (response.success) {
      toast.success('Blog yazısı başarıyla silindi')
      fetchBlogPosts()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'Blog yazısı silinemedi')
    }
  }

  // Update listing status
  const handleToggleListingStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await listingsApi.update(id, { status: newStatus })
    
    if (response.success) {
      toast.success('İlan durumu güncellendi')
      fetchListings()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'İlan durumu güncellenemedi')
    }
  }

  // Update blog post status
  const handleToggleBlogStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const response = await blogApi.update(id, { status: newStatus })
    
    if (response.success) {
      toast.success('Blog yazısı durumu güncellendi')
      fetchBlogPosts()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'Blog yazısı durumu güncellenemedi')
    }
  }

  // Handle edit listing
  const handleEditListing = async (id: string, data: UpdateListingDto) => {
    const response = await listingsApi.update(id, data)
    
    if (response.success) {
      toast.success('İlan başarıyla güncellendi')
      fetchListings()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'İlan güncellenemedi')
      throw new Error(response.error)
    }
  }

  // Handle edit blog post
  const handleEditBlogPost = async (id: string, data: UpdateBlogPostDto) => {
    const response = await blogApi.update(id, data)
    
    if (response.success) {
      toast.success('Blog yazısı başarıyla güncellendi')
      fetchBlogPosts()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'Blog yazısı güncellenemedi')
      throw new Error(response.error)
    }
  }

  // Handle create listing
  const handleCreateListing = async (data: CreateListingDto) => {
    const response = await listingsApi.create(data)
    
    if (response.success) {
      toast.success('İlan başarıyla oluşturuldu')
      setShowAddListing(false)
      fetchListings()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'İlan oluşturulamadı')
      throw new Error(response.error)
    }
  }

  // Handle create blog post
  const handleCreateBlogPost = async (data: CreateBlogPostDto) => {
    const response = await blogApi.create(data)
    
    if (response.success) {
      toast.success('Blog yazısı başarıyla oluşturuldu')
      setShowAddBlog(false)
      fetchBlogPosts()
      if (activeTab === 'dashboard') fetchStats()
    } else {
      toast.error(response.error || 'Blog yazısı oluşturulamadı')
      throw new Error(response.error)
    }
  }

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats()
    } else if (activeTab === 'listings') {
      fetchListings()
    } else if (activeTab === 'blog') {
      fetchBlogPosts()
    }
  }, [activeTab])

  // Search functionality
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === 'listings') {
        fetchListings()
      } else if (activeTab === 'blog') {
        fetchBlogPosts()
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString('tr-TR')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Çıkış başarılı')
        // Call the callback if provided, otherwise reload
        if (onLogout) {
          onLogout()
        } else {
          window.location.href = window.location.href
        }
      } else {
        toast.error('Çıkış yapılamadı')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Bir hata oluştu')
    }
  }

  const renderDashboard = () => {
    if (loading || !stats) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )
    }

    const statsData = [
      { 
        label: "Toplam İlan", 
        value: stats.totalListings.toString(), 
        change: `+${stats.totalListings - stats.activeListings}`, 
        color: "text-blue-600" 
      },
      { 
        label: "Aktif İlan", 
        value: stats.activeListings.toString(), 
        change: `${stats.activeListings}`, 
        color: "text-green-600" 
      },
      { 
        label: "Blog Yazısı", 
        value: stats.totalBlogPosts.toString(), 
        change: `${stats.publishedBlogPosts} yayında`, 
        color: "text-purple-600" 
      }
    ]

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} dark:brightness-125`}>{stat.value}</p>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4 dark:text-white">Görüntüleme İstatistikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Haftalık</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.views.weekly.toLocaleString('tr-TR')}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Son 7 gün</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Aylık</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.views.monthly.toLocaleString('tr-TR')}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Son 30 gün</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Toplam</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.views.total.toLocaleString('tr-TR')}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Tüm zamanlar</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Son İlanlar</h3>
            <div className="space-y-3">
              {stats.recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium dark:text-white">{listing.title}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{listing.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(listing.price, listing.currency)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {formatDate(listing.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Son Blog Yazıları</h3>
            <div className="space-y-3">
              {stats.recentBlogPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1 dark:text-white">{post.title}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{post.views} görüntüleme</p>
                  </div>
                  <div className="text-right ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      post.status === 'published' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {post.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold dark:text-white">İlan Yönetimi</h2>
        <Button 
          onClick={() => setShowAddListing(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni İlan
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-5 w-5" />
              <input
                type="text"
                placeholder="İlan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">İlan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Konum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{listing.title}</div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          {listing.type === 'sale' ? 'Satılık' : 'Kiralık'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{listing.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatPrice(listing.price, listing.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleListingStatus(listing.id, listing.status)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          listing.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}
                      >
                        {listing.status === 'active' ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewingListing(listing)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingListing(listing)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  const renderBlog = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Blog Yönetimi</h2>
        <Button 
          onClick={() => setShowAddBlog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Blog yazısı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Yazar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Görüntüleme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleBlogStatus(post.id, post.status)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          post.status === 'published' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        }`}
                      >
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{post.views}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewingBlogPost(post)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingBlogPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteBlogPost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "listings":
        return renderListings()
      case "blog":
        return renderBlog()
      case "users":
        return <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center dark:text-white">Kullanıcı yönetimi yakında...</div>
      case "settings":
        return <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center dark:text-white">Ayarlar yakında...</div>
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-slate-400">Berke Palaz Gayrimenkul Danışmanlığı Yönetim Paneli</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-64"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setSearchTerm("")
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {showAddListing && (
        <AddListingModal
          isOpen={true}
          onClose={() => setShowAddListing(false)}
          onSave={handleCreateListing}
        />
      )}

      {showAddBlog && (
        <AddBlogModal
          isOpen={true}
          onClose={() => setShowAddBlog(false)}
          onSave={handleCreateBlogPost}
        />
      )}

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          isOpen={true}
          onClose={() => setEditingListing(null)}
          onSave={handleEditListing}
        />
      )}

      {editingBlogPost && (
        <EditBlogModal
          post={editingBlogPost}
          isOpen={true}
          onClose={() => setEditingBlogPost(null)}
          onSave={handleEditBlogPost}
        />
      )}

      {viewingListing && (
        <ViewListingModal
          listing={viewingListing}
          isOpen={true}
          onClose={() => setViewingListing(null)}
        />
      )}

      {viewingBlogPost && (
        <ViewBlogModal
          post={viewingBlogPost}
          isOpen={true}
          onClose={() => setViewingBlogPost(null)}
        />
      )}
    </div>
  )
}
