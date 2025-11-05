import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import LoadingState from "../components/Loadingstate";
import ConfirmationModal from "../components/ConfirmModal";
import AssignmentCard from "../components/AssignmentCard";
import EmptyState from "../components/Emptystate";
import AssignmentFormModal from "../components/AssignmentFormModal";
import SubmissionsModal from "../components/SubmissionsModal";

export default function AssignmentsPage() {
  const { user, logout } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, assignmentId: null });
  const [showSubmissions, setShowSubmissions] = useState(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load users (students) from mockData
        const usersResponse = await fetch("/src/data/mockData.json");
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);

        // Load courses first (from localStorage or JSON)
        const storedCourses = localStorage.getItem("courses_data");
        let coursesData = [];
        
        if (storedCourses) {
          coursesData = JSON.parse(storedCourses);
        } else {
          const coursesResponse = await fetch("/src/data/course.json");
          coursesData = await coursesResponse.json();
          localStorage.setItem("courses_data", JSON.stringify(coursesData));
        }
        setCourses(coursesData);

        // Load assignments (from localStorage or JSON)
        const storedAssignments = localStorage.getItem("assignments_data");
        let assignmentsData = [];
        
        if (storedAssignments) {
          assignmentsData = JSON.parse(storedAssignments);
        } else {
          const assignmentsResponse = await fetch("/src/data/assignments.json");
          assignmentsData = await assignmentsResponse.json();
          localStorage.setItem("assignments_data", JSON.stringify(assignmentsData));
        }
        setAssignments(assignmentsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save assignments whenever they change
  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem("assignments_data", JSON.stringify(assignments));
    }
  }, [assignments]);

  if (!user || loading) return <LoadingState />;

  const showToast = (msg, type = "success") =>
    setToast({ show: true, message: msg, type });

  // Filter visible assignments
  let visibleAssignments = [];
  if (user.role === "admin") {
    visibleAssignments = assignments.filter((a) => a.createdBy === user.id);
  } else {
    const joined = courses
      .filter((c) => c.students && c.students.includes(user.name))
      .map((c) => c.id);
    visibleAssignments = assignments.filter((a) => joined.includes(a.courseId));
  }

  // CRUD handlers
  const handleDelete = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    showToast("Assignment deleted", "info");
  };

  const handleEdit = (a) => {
    setEditItem(a);
    setShowModal(true);
  };

  const handleSubmit = (form) => {
    if (editItem) {
      const updated = assignments.map((a) => (a.id === form.id ? form : a));
      setAssignments(updated);
      showToast("Assignment updated!");
    } else {
      const newItem = {
        ...form,
        id: "a" + Date.now(),
        createdBy: user.id,
        courseId: Number(form.courseId),
        submissions: {},
      };
      setAssignments([...assignments, newItem]);
      showToast("Assignment created!");
    }
    setShowModal(false);
    setEditItem(null);
  };

  // Student submission confirm
  const handleSubmitClick = (id) => setConfirmModal({ isOpen: true, assignmentId: id });

  const confirmSubmission = () => {
    const assignment = assignments.find((a) => a.id === confirmModal.assignmentId);
    
    if (assignment.submissionType === "group") {
      const studentGroup = getStudentGroup(assignment, user.name);
      
      if (!studentGroup) {
        showToast("You are not part of any group for this assignment", "error");
        setConfirmModal({ isOpen: false, assignmentId: null });
        return;
      }
      
      if (studentGroup.leader !== user.name) {
        showToast("Only the group leader can submit this assignment", "error");
        setConfirmModal({ isOpen: false, assignmentId: null });
        return;
      }
      
      const updated = assignments.map((a) =>
        a.id === confirmModal.assignmentId
          ? {
              ...a,
              submissions: {
                ...a.submissions,
                [studentGroup.leader]: {
                  status: "submitted",
                  confirmed: true,
                  submittedAt: new Date().toISOString(),
                  type: "group",
                  groupName: studentGroup.name,
                  groupMembers: [studentGroup.leader, ...(studentGroup.members || [])],
                },
              },
            }
          : a
      );
      setAssignments(updated);
      showToast("Group assignment submitted successfully!");
    } else {
      const updated = assignments.map((a) =>
        a.id === confirmModal.assignmentId
          ? {
              ...a,
              submissions: {
                ...a.submissions,
                [user.name]: {
                  status: "submitted",
                  confirmed: true,
                  submittedAt: new Date().toISOString(),
                  type: "individual",
                },
              },
            }
          : a
      );
      setAssignments(updated);
      showToast("Assignment submitted!");
    }
    
    setConfirmModal({ isOpen: false, assignmentId: null });
  };

  const getCourseTitle = (cid) =>
    courses.find((c) => c.id === cid)?.title || "Unknown Course";

  const getStudentName = (userId) => {
    const student = users.find((u) => u.id === userId);
    return student ? student.name : userId;
  };

  const isStudentInGroup = (assignment, studentName) => {
    if (assignment.submissionType !== "group") return true;
    return assignment.groups?.some(group => 
      group.leader === studentName || (group.members && group.members.includes(studentName))
    ) || false;
  };

  const getStudentGroup = (assignment, studentName) => {
    if (assignment.submissionType !== "group") return null;
    return assignment.groups?.find(group => 
      group.leader === studentName || (group.members && group.members.includes(studentName))
    );
  };

  const handleViewSubmissions = (assignment) => {
    setShowSubmissions(assignment);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar user={user} onLogout={logout} />

        <main className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.role === "admin" ? "Manage Assignments" : "My Assignments"}
              </h1>
              <p className="text-gray-600">
                {user.role === "admin"
                  ? "Create, update, or delete course assignments"
                  : "View and submit your assignments"}
              </p>
            </div>

            {user.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Assignment
              </button>
            )}
          </div>

          {/* Assignment Cards Grid */}
          {visibleAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  user={user}
                  courses={courses}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewSubmissions={handleViewSubmissions}
                  onSubmitClick={handleSubmitClick}
                  getCourseTitle={getCourseTitle}
                  getStudentGroup={getStudentGroup}
                  isStudentInGroup={isStudentInGroup}
                />
              ))}
            </div>
          ) : (
            <EmptyState user={user} />
          )}
        </main>
      </div>

      {/* Modals */}
      {showModal && (
        <AssignmentFormModal
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
          onSubmit={handleSubmit}
          editItem={editItem}
          courses={courses}
          users={users}
        />
      )}

      {confirmModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title="Confirm Submission"
          message="Are you sure you want to mark this assignment as submitted?"
          confirmText="Yes, Submit"
          cancelText="Cancel"
          onClose={() => setConfirmModal({ isOpen: false, assignmentId: null })}
          onConfirm={confirmSubmission}
        />
      )}

      {showSubmissions && (
        <SubmissionsModal
          assignment={showSubmissions}
          courses={courses}
          users={users}
          onClose={() => setShowSubmissions(null)}
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