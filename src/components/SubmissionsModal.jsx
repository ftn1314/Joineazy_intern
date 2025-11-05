import React from "react";

export default function SubmissionsModal({ assignment, courses, users, onClose }) {
  const submissions = assignment.submissions || {};
  const submissionList = Object.entries(submissions);
  
  const getCourseTitle = (cid) =>
    courses.find((c) => c.id === cid)?.title || "Unknown Course";

  const getStudentName = (userId) => {
    const student = users.find((u) => u.id === userId);
    return student ? student.name : userId;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Submissions: {assignment.title}
          </h2>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-sm text-gray-700 font-medium">
              Course: <span className="text-indigo-700">{getCourseTitle(assignment.courseId)}</span> | 
              Due: <span className="text-indigo-700">{assignment.dueDate}</span>
            </p>
            {assignment.submissionType === "group" && (
              <p className="text-sm text-gray-700 font-medium mt-1">
                Groups: <span className="text-purple-700">{assignment.groups?.length || 0}</span> | 
                Submission Rate: <span className="text-green-700">{submissionList.length}/{assignment.groups?.length || 0}</span> groups
              </p>
            )}
          </div>
        </div>

        {submissionList.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Submissions Yet</h3>
            <p className="text-gray-500 text-lg">
              No {assignment.submissionType === "group" ? "groups" : "students"} have submitted this assignment yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
              <p className="text-lg font-semibold text-gray-800 text-center">
                Total Submissions: <span className="text-indigo-600">{submissionList.length}</span>
                {assignment.submissionType === "group" && (
                  <span className="ml-6">
                    Groups Remaining: <span className="text-orange-600">
                      {(assignment.groups?.length || 0) - submissionList.length}
                    </span>
                  </span>
                )}
              </p>
            </div>

            {submissionList.map(([userId, submission], index) => (
              <div key={userId} className="border-2 border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        {submission.type === "group" ? "Group: " : "Student: "}
                        {submission.type === "group" ? submission.groupName : getStudentName(userId)}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        submission.status === "submitted" 
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}>
                        {submission.status === "submitted" ? "✓ Submitted" : "⏳ Pending"}
                      </span>
                      {submission.type === "group" && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-300">
                          Group Submission
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-700">
                      <p><span className="font-semibold">Submitted by:</span> {getStudentName(userId)}{submission.type === "group" && " (Leader)"}</p>
                      <p><span className="font-semibold">Submitted at:</span> {formatDate(submission.submittedAt)}</p>
                      
                      {submission.confirmed && (
                        <p className="text-green-600 font-semibold">
                          ✓ Confirmed by {submission.type === "group" ? "group leader" : "student"}
                        </p>
                      )}
                      
                      {submission.type === "group" && submission.groupMembers && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <p className="font-semibold text-gray-800 mb-3">Group Members ({submission.groupMembers.length})</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {submission.groupMembers.map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                                <div className={`w-2 h-2 rounded-full ${member === userId ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                <span className="text-sm font-medium text-gray-700">
                                  {member} {member === userId && "(Leader)"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg transition-all hover:scale-105"
          >
            Close Submissions
          </button>
        </div>
      </div>
    </div>
  );
}