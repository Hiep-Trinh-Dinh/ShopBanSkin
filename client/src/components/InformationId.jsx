'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { fetchDetailPost } from '../services/post-service';

export default function InformationId() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetchDetailPost(id);
      if (response.success) {
        setPost(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch post detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-8">
          <div className="text-center py-4">Loading...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-8">
          <div className="text-center py-4">Post not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-contain bg-gray-100"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <p>Published on: {new Date(post.createdAt).toLocaleDateString()}</p>
              <p>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
            </div>
            
            {/* Content section */}
            <div className="prose max-w-none">
              {/* Chia nội dung thành các đoạn văn */}
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}