import React from "react";

export default function AssignmentCard({ assignment, user, courses, onEdit, onDelete, onViewSubmissions, onSubmitClick, getCourseTitle, getStudentGroup, isStudentInGroup }) {
  const studentGroup = getStudentGroup(assignment, user.name);
  
  const getSubmissionStatus = () => {
    if (assignment.submissionType === "group") {
      if (assignment.submissions?.[studentGroup?.leader]?.status === "submitted") {
        return "submitted";
      }
      return "pending";
    } else {
      if (assignment.submissions?.[user.name]?.status === "submitted") {
        return "submitted";
      }
      return "pending";
    }
  };

  const submissionStatus = getSubmissionStatus();

  // FIXED: Calculate submission progress based on actual data structure
  const getSubmissionProgress = () => {
    if (user.role !== "admin") return null;
    
    const totalSubmissions = Object.keys(assignment.submissions || {}).length;
    
    if (assignment.submissionType === "group") {
      // For group assignments, progress is based on groups
      const totalGroups = assignment.groups?.length || 0;
      const percentage = totalGroups > 0 ? Math.round((totalSubmissions / totalGroups) * 100) : 0;
      
      return {
        current: totalSubmissions,
        total: totalGroups,
        percentage: percentage,
        type: "groups"
      };
    } else {
      // For individual assignments, we need to get enrolled students from the course
      const course = courses.find(c => c.id === assignment.courseId);
      const enrolledStudents = course?.students || [];
      const totalStudents = enrolledStudents.length;
      
      // Calculate actual submissions from enrolled students
      const studentSubmissions = Object.keys(assignment.submissions || {}).filter(
        submitter => enrolledStudents.includes(submitter)
      ).length;
      
      const percentage = totalStudents > 0 ? Math.round((studentSubmissions / totalStudents) * 100) : 0;
      
      return {
        current: studentSubmissions,
        total: totalStudents,
        percentage: percentage,
        type: "students"
      };
    }
  };

  const progress = getSubmissionProgress();

  // Get status color and icon
  const getStatusConfig = () => {
    if (submissionStatus === "submitted") {
      return {
        color: "green",
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ),
        text: "Submitted"
      };
    }
    return {
      color: "yellow",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "Pending"
    };
  };

  const statusConfig = getStatusConfig();

  // Safe progress display for admin
  const renderProgressBar = () => {
    if (!progress || progress.total === 0) {
      return (
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
            <span className="font-medium">No submissions yet</span>
            <span className="font-semibold">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-gray-300" style={{ width: '0%' }} />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
          <span className="font-medium">
            Submissions: {progress.current}/{progress.total} {progress.type}
          </span>
          <span className="font-semibold">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              progress.percentage === 100 
                ? "bg-green-500" 
                : progress.percentage >= 50 
                ? "bg-yellow-500" 
                : "bg-red-500"
            }`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        {progress.percentage === 100 && (
          <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            All {progress.type} have submitted
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-indigo-200 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {assignment.title}
          </h3>
          <p className="text-sm text-indigo-600 font-medium mb-2">
            {getCourseTitle(assignment.courseId)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            assignment.submissionType === "group" 
              ? "bg-purple-100 text-purple-800 border border-purple-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}>
            {assignment.submissionType === "group" ? "👥 Group" : "👤 Individual"}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            submissionStatus === "submitted" 
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }`}>
            {statusConfig.icon}
            {statusConfig.text}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {assignment.description}
      </p>

      {/* Submission Progress Bar (Admin Only) */}
      {user.role === "admin" && renderProgressBar()}

      {/* Group Info */}
      {assignment.submissionType === "group" && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">
              {user.role === "admin" ? "Groups" : "Your Group"}
            </span>
            <span className="font-semibold text-indigo-700">
              {user.role === "admin" 
                ? `${assignment.groups?.length || 0} groups`
                : studentGroup?.name || "Not assigned"
              }
            </span>
          </div>
          
          {user.role !== "admin" && studentGroup && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Group Leader:</span>
                <span className={`font-medium flex items-center gap-1 ${
                  studentGroup.leader === user.name ? "text-green-600" : "text-gray-700"
                }`}>
                  {studentGroup.leader}
                  {studentGroup.leader === user.name && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </div>
              {studentGroup.members && studentGroup.members.length > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Group Members:</span>
                  <span className="font-medium text-gray-700">
                    {studentGroup.members.length} member{studentGroup.members.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Due Date & Drive Link */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Due: {assignment.dueDate}</span>
          </div>
          
          {/* Due Date Status Badge */}
          {(() => {
            try {
              const dueDate = new Date(assignment.dueDate);
              const today = new Date();
              const timeDiff = dueDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
              
              if (daysDiff < 0) {
                return (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium border border-red-200">
                    Overdue
                  </span>
                );
              } else if (daysDiff <= 3) {
                return (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium border border-orange-200">
                    Due soon
                  </span>
                );
              }
              return null;
            } catch (error) {
              return null; // Safe fallback if date parsing fails
            }
          })()}
        </div>
        
        {assignment.driveLink && (
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Drive Link
          </a>
        )}
      </div>

      {/* Action Buttons */}
      {user.role === "admin" ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(assignment)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-all duration-200 font-medium hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(assignment.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl border border-red-200 hover:bg-red-100 transition-all duration-200 font-medium hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
          <button
            onClick={() => onViewSubmissions(assignment)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-all duration-200 font-medium hover:scale-105 group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Submissions 
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                progress && progress.current === progress.total
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {progress ? `${progress.current}/${progress.total}` : '0/0'}
              </span>
            </div>
          </button>
        </div>
      ) : (
        <>
          {assignment.submissionType === "group" && !isStudentInGroup(assignment, user.name) ? (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm font-medium">
                  You are not part of any group. Please contact your professor.
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onSubmitClick(assignment.id)}
              disabled={
                submissionStatus === "submitted" ||
                (assignment.submissionType === "group" && studentGroup?.leader !== user.name)
              }
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                submissionStatus === "submitted"
                  ? "bg-green-100 text-green-700 border border-green-300 cursor-not-allowed"
                  : assignment.submissionType === "group" && studentGroup?.leader !== user.name
                  ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {submissionStatus === "submitted" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span>Assignment Submitted</span>
                  </div>
                </>
              ) : assignment.submissionType === "group" && studentGroup?.leader !== user.name ? (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Only Leader Can Submit</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit Assignment</span>
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}