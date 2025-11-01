import React, { useState } from "react";

export default function CreateNewAssignment({ user, store, setStore, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
    selectedStudents: [],
  });

  const [errors, setErrors] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const students = store?.users?.filter((u) => u.role === "student") || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter((id) => id !== studentId)
        : [...prev.selectedStudents, studentId],
    }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setFormData((prev) => ({ ...prev, selectedStudents: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedStudents: students.map((s) => s.id),
      }));
    }
    setSelectAll(!selectAll);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    if (!formData.driveLink.trim()) {
      newErrors.driveLink = "Google Drive link is required";
    } else if (!isValidUrl(formData.driveLink)) {
      newErrors.driveLink = "Please enter a valid URL";
    }

    if (formData.selectedStudents.length === 0) {
      newErrors.selectedStudents = "Please select at least one student";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const confirmCreate = () => {
    const newAssignment = {
      id: `assign_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: new Date(formData.dueDate).toLocaleDateString(),
      driveLink: formData.driveLink.trim(),
      createdBy: user.id,
      submissions: formData.selectedStudents.reduce((acc, studentId) => {
        acc[studentId] = { status: "pending", confirmed: false };
        return acc;
      }, {}),
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...store,
      assignments: [...(store.assignments || []), newAssignment],
    };

    setStore(updated);
    localStorage.setItem("dashboardData", JSON.stringify(updated));
    
    setShowConfirmModal(false);
    if (onSuccess) {
      onSuccess("Assignment created successfully!");
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in the details to assign work to students</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Assignment Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., React Hooks Assignment"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <ErrorIcon className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Provide a detailed description of the assignment..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.description ? (
                  <p className="text-sm text-red-600 flex items-center">
                    <ErrorIcon className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.description.length} characters
                  </p>
                )}
              </div>
            </div>

            {/* Due Date and Drive Link - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.dueDate
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ErrorIcon className="w-4 h-4 mr-1" />
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Google Drive Link */}
              <div>
                <label htmlFor="driveLink" className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Drive Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="driveLink"
                    name="driveLink"
                    value={formData.driveLink}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/..."
                    className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.driveLink
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                  />
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.driveLink && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ErrorIcon className="w-4 h-4 mr-1" />
                    {errors.driveLink}
                  </p>
                )}
              </div>
            </div>

            {/* Student Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Assign to Students <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto custom-scrollbar">
                {students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center p-3 bg-white rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors border border-transparent hover:border-indigo-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedStudents.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="ml-3 flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center ring-2 ring-white">
                            <span className="text-sm font-bold text-indigo-600">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email || "No email"}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No students available</p>
                )}
              </div>

              {errors.selectedStudents && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <ErrorIcon className="w-4 h-4 mr-1" />
                  {errors.selectedStudents}
                </p>
              )}

              {formData.selectedStudents.length > 0 && (
                <p className="mt-2 text-sm text-indigo-600 font-medium">
                  ✓ {formData.selectedStudents.length} student(s) selected
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Assignment?</h3>
                <p className="text-gray-600">
                  Are you sure you want to create "{formData.title}" and assign it to {formData.selectedStudents.length} student(s)?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmCreate}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                >
                  Yes, Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Icon Components
const ErrorIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);