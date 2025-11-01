import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useLocalStore from "../hooks/useLocalStore";
import seedData from "../data/mockData.json";

// Components
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
  const [store, setStore] = useLocalStore(seedData);
  const [modalState, setModalState] = useState({ isOpen: false, assignmentId: null, assignmentTitle: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Loading state
  if (!user || !store) {
    return <LoadingState />;
  }

  const assignments = store.assignments || [];

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Handle submission confirmation
  const handleSubmitClick = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setModalState({
      isOpen: true,
      assignmentId,
      assignmentTitle: assignment?.title || "this assignment"
    });
  };

  const confirmSubmission = () => {
    const updated = { ...store };
    const assignment = updated.assignments.find((a) => a.id === modalState.assignmentId);
    
    if (assignment) {
      assignment.submissions[user.id] = {
        status: "submitted",
        confirmed: true,
        submittedAt: new Date().toISOString(),
      };
      
      setStore(updated);
      localStorage.setItem("dashboardData", JSON.stringify(updated));
      showToast("Assignment submitted successfully!", "success");
    }
    
    setModalState({ isOpen: false, assignmentId: null, assignmentTitle: "" });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, assignmentId: null, assignmentTitle: "" });
  };

  const handleCreateSuccess = (message) => {
    showToast(message, "success");
  };

  /** ✅ STUDENT DASHBOARD **/
  if (user.role === "student") {
    const studentAssignments = assignments.map((a) => ({
      ...a,
      submission: a.submissions[user.id],
    }));

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <DashboardHeader
            title="Student Dashboard"
            subtitle="Track and submit your assignments"
            user={user}
            onLogout={logout}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                My Assignments
              </h2>
              <p className="text-gray-600">
                {studentAssignments.length} assignment{studentAssignments.length !== 1 ? 's' : ''} assigned to you
              </p>
            </div>

            {/* Assignments Grid */}
            {studentAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {studentAssignments.map((assignment) => (
                  <StudentAssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onSubmit={handleSubmitClick}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="student" />
            )}
          </main>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={confirmSubmission}
          title="Confirm Submission"
          message={`Are you sure you want to mark "${modalState.assignmentTitle}" as submitted? This action will notify your instructor.`}
          confirmText="Yes, Submit"
          cancelText="Cancel"
        />

        {/* Toast Notification */}
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

  /** ✅ ADMIN DASHBOARD **/
  const adminAssignments = assignments.filter((a) => a.createdBy === user.id);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader
          title="Admin Dashboard"
          subtitle="Manage assignments and track submissions"
          user={user}
          onLogout={logout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Your Assignments
                </h2>
                <p className="text-gray-600">
                  {adminAssignments.length} assignment{adminAssignments.length !== 1 ? 's' : ''} created by you
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Assignment
              </button>
            </div>
          </div>

          {/* Assignments Grid */}
          {adminAssignments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {adminAssignments.map((assignment) => (
                <AdminAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  students={store.users}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="admin" />
          )}
        </main>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <CreateNewAssignment
          user={user}
          store={store}
          setStore={setStore}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Toast Notification */}
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