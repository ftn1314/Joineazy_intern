import React from 'react';
import { CalendarIcon } from './Icons';

export default function AdminAssignmentCard({ assignment, students }) {
  const totalStudents = Object.keys(assignment.submissions).length;
  const submittedCount = Object.values(assignment.submissions).filter(
    (s) => s.status === 'submitted'
  ).length;
  const progress = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>

        {/* Due Date */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>Due: {assignment.dueDate}</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Submission Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {submittedCount}/{totalStudents}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{progress}% completed</p>
        </div>

        {/* Student Submissions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Student Submissions
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {Object.entries(assignment.submissions).map(([studentId, sub]) => {
              const student = students.find((u) => u.id === studentId);
              return (
                <div
                  key={studentId}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center ring-2 ring-white">
                      <span className="text-xs font-bold text-indigo-600">
                        {student?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {student?.name || 'Unknown Student'}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'submitted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {sub.status === 'submitted' ? '✓ Submitted' : '⏱ Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}