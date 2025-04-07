import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/diaries/${id}`);
        setDiary(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '获取日记失败');
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这篇日记吗？')) return;

    try {
      await axios.delete(`/api/diaries/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '删除失败');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!diary) {
    return <ErrorMessage message="日记不存在" />;
  }

  const isAuthor = user && diary.author._id === user._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{diary.title}</h1>
          {diary.isPrivate && (
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              私密
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-6">
          <span className="font-medium">{diary.author.username}</span>
          <span className="mx-2">•</span>
          <span>{format(new Date(diary.createdAt), 'yyyy-MM-dd HH:mm')}</span>
        </div>

        <div 
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: diary.content }}
        />

        {isAuthor && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/edit/${diary._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              编辑
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              删除
            </button>
          </div>
        )}
      </div>

      <CommentSection diaryId={id} />
    </div>
  );
};

export default DiaryDetail;