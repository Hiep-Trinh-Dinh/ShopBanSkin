'use client'

import { useState, useEffect, use } from 'react'
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa'
import Pagination from '../Pagination'
import { createPost, fetchAllPosts, deletePost, editPost } from '../../services/post-service';
import * as Alert from '../Alert'
import { useMutation } from '@tanstack/react-query';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: null,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const postsPerPage = 6

  // Fetch posts khi component mount hoặc currentPage thay đổi
  useEffect(() => {
    fetchPosts();
  }, [currentPage, refresh])

  const fetchPosts = async () => {
    try {
      const response = await fetchAllPosts(currentPage, postsPerPage)
      setPosts(response.data)
      setTotalPages(response.totalPages)
      setTotalPosts(response.totalProducts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const handleEdit = (post) => {
    setSelectedPost(post)
    setNewPost({
      title: post.title,
      content: post.content,
      image: null // Reset image khi edit
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (postId) => {
    try {
      mutationDeletePost.mutate(postId);
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleView = (post) => {
    setSelectedPost(post)
    setIsDetailModalOpen(true)
  }

  const handleAddPost = () => {
    setNewPost({
      title: '',
      content: '',
      image: null,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', newPost.title)
      formData.append('content', newPost.content)
      if (newPost.image) {
        formData.append('image', newPost.image)
      }
      mutationCreatePost.mutate(formData);
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);
        if (newPost.image) {
            formData.append('image', newPost.image);
        }
        console.log("post", selectedPost._id, formData)
        mutationEditPost.mutate({ id: selectedPost._id, data: formData });
    } catch (error) {
        console.error('Failed to update post:', error);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setNewPost(prev => ({
      ...prev,
      image: file
    }))
  }

  const mutationCreatePost = useMutation({
    mutationFn: async (data) => {
      return await createPost(data)
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      setRefresh(!refresh);
      setIsModalOpen(false)
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Failed to create post:', error)
    }
  });

  const mutationEditPost = useMutation({
    mutationFn: async ({ id, data }) => {
      return await editPost(id, data); 
  },
    onSuccess: (data) => {
      Alert.success(data.message);
      setRefresh(!refresh);
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Failed to create post:', error)
    }
  })

  const mutationDeletePost = useMutation({
    mutationFn: async (id) => {
      return await deletePost(id)
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      setRefresh(!refresh);
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Failed to create post:', error)
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <button 
          onClick={handleAddPost} 
          className="flex items-center text-green-600 hover:text-green-900"
        >
          <FaPlus className="mr-1" /> Thêm bài post mới
        </button>
      </div>

      {/* Modal thêm bài post */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Thêm bài post mới</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Tiêu đề bài post</label>
                <input 
                  type="text" 
                  value={newPost.title} 
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                  required 
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nội dung</label>
                <textarea 
                  value={newPost.content} 
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
                  required 
                  className="border rounded w-full py-2 px-3" 
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Hình ảnh</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  required 
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                  Thêm
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa bài post */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Sửa bài post</h2>
            <form onSubmit={handleUpdatePost}>
              <div className="mb-4">
                <label className="block text-gray-700">Tiêu đề bài post</label>
                <input 
                  type="text" 
                  value={newPost.title} 
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                  required 
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nội dung</label>
                <textarea 
                  value={newPost.content} 
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
                  required 
                  className="border rounded w-full py-2 px-3" 
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Hình ảnh mới (không bắt buộc)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                  Lưu
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal hiển thị chi tiết */}
      {isDetailModalOpen && selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedPost.title}</h2>
            <img src={selectedPost.image} alt={selectedPost.title}  className="h-[400px] mx-auto block mb-4"/>
            <p><strong>Nội dung:</strong> {selectedPost.content}</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bảng hiển thị danh sách posts */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex-grow">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={post.image} alt={post.title} className="w-16 h-16 rounded object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleView(post)} className="text-gray-600 hover:text-gray-900 mr-2">
                      <FaEye />
                    </button>
                    <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-900 mr-2">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Phân trang */}
      <div className="mt-4">
        <Pagination 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          totalPosts={totalPosts} 
          totalPages={totalPages}
          postsPerPage={postsPerPage} 
        />
      </div>
    </div>
  )
}