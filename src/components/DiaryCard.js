import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const DiaryCard = ({ diary }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/diary/${diary._id}`}>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{diary.title}</h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-3">{diary.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{diary.author.username}</span>
        <span>{format(new Date(diary.createdAt), 'yyyy-MM-dd HH:mm')}</span>
      </div>
    </div>
  );
};

export default DiaryCard;