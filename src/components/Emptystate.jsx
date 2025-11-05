import React from 'react';

export default function EmptyState({ user, type = "student" }) {
  const isStudent = type === "student" || user?.role === "student";
  const isAdmin = type === "admin" || user?.role === "admin";

  return (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl shadow-sm text-center py-16 px-6">
      {/* Icon Section */}
      <div className="w-20 h-20 text-gray-300 mx-auto mb-6">
        {isStudent ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )}
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        {isStudent ? "No Assignments Yet" : "No Assignments Created"}
      </h3>
      
      <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
        {isStudent 
          ? "You don't have any assignments at the moment. Check back later or contact your instructor if you're expecting to see assignments here."
          : "Create your first assignment to get started with course management and track student submissions."
        }
      </p>

      {/* Optional decorative elements */}
      <div className="mt-8 flex justify-center space-x-2">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
            style={{ animationDelay: `${dot * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}