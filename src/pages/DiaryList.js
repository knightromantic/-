import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DiaryCard from '../components/DiaryCard';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DiaryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('public');

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const endpoint = filter === 'public' ? '/api/diaries/public' : '/api/diaries/my';
        const response = await axios.get(endpoint);
        setDiaries(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(err.response?.data?.message || '获取日记失败');
        }
      } finally {
        setLoading(false);
      }
    };

    if (filter === 'my' && !user) {
      navigate('/login');
    } else {
      fetchDiaries();
    }
  }, [filter, user, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">日记列表</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('public')}
            className={`px-4 py-2 rounded ${
              filter === 'public'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            公开日记
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-4 py-2 rounded ${
              filter === 'my'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            我的日记
          </button>
          {user && (
            <button
              onClick={() => navigate('/new')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              写新日记
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diaries.map((diary) => (
          <DiaryCard key={diary._id} diary={diary} />
        ))}
      </div>

      {diaries.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          暂无日记
        </div>
      )}
    </div>
  );
};

export default DiaryList;