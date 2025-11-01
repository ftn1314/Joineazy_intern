import React from 'react';
import { CalendarIcon, ExternalLinkIcon } from './Icons';

export default function StudentAssignmentCard({ assignment, onSubmit }) {
  const isSubmitted = assignment.submission?.status === 'submitted';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-2 group-hover:text-indigo-600 transition-colors">
            {assignment.title}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
              isSubmitted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {isSubmitted ? '✓ Submitted' : '⏱ Pending'}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assignment.description}</p>

        {/* Meta Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>Due: {assignment.dueDate}</span>
          </div>
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium group/link"
          >
            <ExternalLinkIcon className="w-4 h-4 mr-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            View Assignment Files
          </a>
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <button
            onClick={() => onSubmit(assignment.id)}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Mark as Submitted
          </button>
        )}

        {isSubmitted && assignment.submission?.submittedAt && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Submitted on {new Date(assignment.submission.submittedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}