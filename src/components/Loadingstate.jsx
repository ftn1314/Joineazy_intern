import React from 'react';
import { LoadingSpinner } from './Icons';

export default function LoadingState({ message = "Loading dashboard..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}