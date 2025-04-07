import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      {message}
    </div>
  );
};

export default ErrorMessage;