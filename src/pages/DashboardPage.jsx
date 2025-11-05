import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Components
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/Dashboardheader";
import StudentAssignmentCard from "../components/Studentassignmentcard";
import AdminAssignmentCard from "../components/Adminassignmentcard";
import ConfirmationModal from "../components/ConfirmModal";
import LoadingState from "../components/Loadingstate";
import EmptyState from "../components/Emptystate";
import Toast from "../components/Toast";
import CreateNewAssignment from "../components/Createnewassignment";

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const [modalState, setModalState] = useState({ isOpen: false, assignmentId: null, assignmentTitle: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user) {
    return <LoadingState />;
  }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSubmitClick = (assignmentId) => {
    const assignment = { title: "Assignment" }; // Mock data
    setModalState({
      isOpen: true,
      assignmentId,
      assignmentTitle: assignment?.title || "this assignment"
    });
  };

  const confirmSubmission = () => {
    showToast("Assignment submitted successfully!", "success");
    setModalState({ isOpen: false, assignmentId: null, assignmentTitle: "" });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, assignmentId: null, assignmentTitle: "" });
  };

  const handleCreateSuccess = (message) => {
    showToast(message, "success");
  };

  /** STUDENT DASHBOARD */
  if (user.role === "student") {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar user={user} onLogout={logout} />
          
          {/* <DashboardHeader
            title="Student Dashboard"
            subtitle="Track and submit your assignments"
            user={user}
            onLogout={logout}
          /> */}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                My Assignments
              </h2>
              <p className="text-gray-600">
                Your assigned coursework will appear here
              </p>
            </div>

            <EmptyState type="student" />
          </main>
        </div>

        <ConfirmationModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={confirmSubmission}
          title="Confirm Submission"
          message={`Are you sure you want to mark "${modalState.assignmentTitle}" as submitted?`}
          confirmText="Yes, Submit"
          cancelText="Cancel"
        />

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </>
    );
  }

  /** ADMIN DASHBOARD */
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar user={user} onLogout={logout} />
        
        {/* <DashboardHeader
          title="Professor Dashboard"
          subtitle="Manage assignments and track student progress"
          user={user}
          onLogout={logout}
        /> */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Your Assignments
                </h2>
                <p className="text-gray-600">
                  Create and manage assignments for your students
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Assignment
              </button>
            </div>
          </div>

          <EmptyState type="admin" />
        </main>
      </div>

      {showCreateModal && (
        <CreateNewAssignment
          user={user}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}