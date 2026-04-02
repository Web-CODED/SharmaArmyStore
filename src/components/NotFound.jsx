import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found.</p>
      <p className="mt-2 text-sm text-gray-500">The page you are looking for may have been removed or is temporarily unavailable.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-5 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
