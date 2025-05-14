'use client'

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { fetchAllPosts } from '../services/post-service';

export default function InformationPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 5;

  // Fetch posts khi component mount hoặc currentPage thay đổi
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllPosts(currentPage, postsPerPage);
      setPosts(response.data);
      setTotalPages(response.totalPages);
      setTotalPosts(response.totalProducts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-8">
        <h1 className="text-3xl font-bold mb-8">Latest Product Information</h1>
        
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="grid gap-8 mb-8">
            {posts.map((post) => (
              <Link 
                to={`/information/${post._id}`} 
                key={post._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300"
              >
                <div className="md:w-1/3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-60 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    Published on: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === number
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}