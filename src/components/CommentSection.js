import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const CommentSection = ({ diaryId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/diaries/${diaryId}/comments`);
        setComments(response.data);
      } catch (err) {
        setError('获取评论失败');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [diaryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`/api/diaries/${diaryId}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('发表评论失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;

    try {
      await axios.delete(`/api/diaries/${diaryId}/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError('删除评论失败');
    }
  };

  if (loading && comments.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">评论</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="写下你的评论..."
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '发表中...' : '发表评论'}
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-4">请登录后发表评论</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{comment.author.username}</p>
                <p className="text-gray-600 text-sm">
                  {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm')}
                </p>
              </div>
              {user && user._id === comment.author._id && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              )}
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center">暂无评论</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;