import React, { useState } from "react";

export default function AssignmentFormModal({ onClose, onSubmit, editItem, courses, users }) {
  const [form, setForm] = useState(
    editItem || {
      title: "",
      description: "",
      dueDate: "",
      driveLink: "",
      courseId: courses.length > 0 ? courses[0].id : "",
      submissionType: "individual",
      groups: [],
    }
  );

  const [newGroupName, setNewGroupName] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const students = users.filter((u) => u.role === "student");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const addGroup = () => {
    if (newGroupName && selectedLeader) {
      const newGroup = {
        name: newGroupName,
        leader: selectedLeader,
        members: selectedMembers.filter(member => member !== selectedLeader),
      };

      setForm({
        ...form,
        groups: [...(form.groups || []), newGroup],
      });

      setNewGroupName("");
      setSelectedLeader("");
      setSelectedMembers([]);
    }
  };

  const removeGroup = (groupName) => {
    setForm({
      ...form,
      groups: (form.groups || []).filter((g) => g.name !== groupName),
    });
  };

  const addMemberToSelection = (member) => {
    if (member && !selectedMembers.includes(member) && member !== selectedLeader) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const removeMemberFromSelection = (member) => {
    setSelectedMembers(selectedMembers.filter((m) => m !== member));
  };

  // FIXED: Get available students for leader selection
  const getAvailableStudentsForLeader = () => {
    const allAssignedStudents = (form.groups || []).flatMap(group => 
      [group.leader, ...(group.members || [])]
    );
    
    return students.filter(student => 
      !allAssignedStudents.includes(student.name) &&
      !selectedMembers.includes(student.name)
    );
  };

  // FIXED: Get available students for member selection
  const getAvailableStudentsForMembers = () => {
    const allAssignedStudents = (form.groups || []).flatMap(group => 
      [group.leader, ...(group.members || [])]
    );
    
    return students.filter(student => 
      !allAssignedStudents.includes(student.name) &&
      !selectedMembers.includes(student.name) &&
      student.name !== selectedLeader
    );
  };

  const availableLeaders = getAvailableStudentsForLeader();
  const availableMembers = getAvailableStudentsForMembers();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {editItem ? "Edit Assignment" : "Create New Assignment"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              
              <input
                type="text"
                placeholder="Assignment Title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Assignment Description"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                
                <input
                  type="url"
                  placeholder="Google Drive Link (Optional)"
                  value={form.driveLink}
                  onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: Number(e.target.value) })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <select
                value={form.submissionType}
                onChange={(e) => setForm({ ...form, submissionType: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="individual">Individual Submission</option>
                <option value="group">Group Submission</option>
              </select>
            </div>

            {/* Group Management */}
            {form.submissionType === "group" && (
              <div className="space-y-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900">Group Management</h3>
                
                {/* Add New Group */}
                <div className="bg-white p-6 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-4">Create New Group</h4>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Group Name (e.g., Group A, Team Alpha)"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group Leader *
                      </label>
                      <select
                        value={selectedLeader}
                        onChange={(e) => setSelectedLeader(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      >
                        <option value="">Select Group Leader</option>
                        {availableLeaders.map((student) => (
                          <option key={student.id} value={student.name}>
                            {student.name} ({student.id})
                          </option>
                        ))}
                      </select>
                      {availableLeaders.length === 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          No available students to assign as leader. All students are already in groups.
                        </p>
                      )}
                      {availableLeaders.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {availableLeaders.length} student(s) available for leader role
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Group Members (Optional)
                      </label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addMemberToSelection(e.target.value);
                          }
                        }}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white mb-3"
                      >
                        <option value="">Select members to add</option>
                        {availableMembers.map((student) => (
                          <option key={student.id} value={student.name}>
                            {student.name} ({student.id})
                          </option>
                        ))}
                      </select>
                      
                      {selectedMembers.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Selected Members ({selectedMembers.length})
                          </p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedMembers.map((member, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700 font-medium">{member}</span>
                                  {member === selectedLeader && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                      Leader
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeMemberFromSelection(member)}
                                  className="text-red-600 hover:text-red-800 font-semibold text-sm px-2 py-1 hover:bg-red-50 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={addGroup}
                      disabled={!newGroupName || !selectedLeader}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        !newGroupName || !selectedLeader
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                      }`}
                    >
                      + Add Group
                    </button>
                  </div>
                </div>

                {/* Existing Groups */}
                {(form.groups || []).length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Existing Groups ({(form.groups || []).length})
                    </h4>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {(form.groups || []).map((group, index) => (
                        <div key={group.name} className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-lg font-bold text-gray-900">{group.name}</span>
                              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                Leader: {group.leader}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGroup(group.name)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg px-2 py-1 hover:bg-red-50 rounded"
                            >
                              ×
                            </button>
                          </div>
                          
                          {(group.members || []).length > 0 && (
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Members:</span>{" "}
                              <span className="text-gray-600">{(group.members || []).join(", ")}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-2 font-medium">
                            Total: {1 + (group.members || []).length} members
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Students Summary */}
                <div className="bg-white p-4 rounded-xl border">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">
                      Available Students: {availableLeaders.length} / {students.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {students.length - availableLeaders.length} student(s) already assigned to groups
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={courses.length === 0 || (form.submissionType === "group" && (form.groups || []).length === 0)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                courses.length === 0 || (form.submissionType === "group" && (form.groups || []).length === 0)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              }`}
            >
              {editItem ? "Update Assignment" : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}