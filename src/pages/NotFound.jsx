import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 flex items-center">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-7xl font-extrabold text-blue-400">404</h1>
        <p className="mt-6 text-xl text-gray-300">Page not found</p>
        <p className="mt-2 text-gray-500">The page you are looking for doesn’t exist or has been moved.</p>
        <div className="mt-8">
          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


