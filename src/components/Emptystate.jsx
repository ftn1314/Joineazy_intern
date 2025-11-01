import React from 'react';
import { AssignmentIcon, CreateAssignmentIcon } from './Icons';

export default function EmptyState({ type = "student" }) {
  const isStudent = type === "student";

  return (
    <div className="text-center py-16 px-4">
      <div className="w-24 h-24 mx-auto mb-6 text-gray-300 opacity-50">
        {isStudent ? <AssignmentIcon /> : <CreateAssignmentIcon />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isStudent ? "No assignments yet" : "No assignments created"}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {isStudent
          ? "You don't have any assignments at the moment. Check back later!"
          : "Create your first assignment to get started with tracking student submissions."}
      </p>
    </div>
  );
}