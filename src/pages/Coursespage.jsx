// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Navbar from "../components/Navbar";
// import LoadingState from "../components/Loadingstate";
// import Toast from "../components/Toast";

// export default function CoursesPage() {
//   const { user, logout } = useContext(AuthContext);
//   const [courses, setCourses] = useState([]);
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDetail, setShowDetail] = useState(null);
//   const [showManageModal, setShowManageModal] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
//   const [newCourse, setNewCourse] = useState({
//     title: "",
//     description: "",
//     duration: "",
//     level: "Beginner",
//     color: "bg-indigo-500",
//   });

//   // ✅ Load courses from localStorage or JSON file
//   useEffect(() => {
//     const saved = localStorage.getItem("courses_data");
//     if (saved) {
//       setCourses(JSON.parse(saved));
//       setLoading(false);
//     } else {
//       fetch("/src/data/course.json")
//         .then((res) => res.json())
//         .then((data) => {
//           setCourses(data);
//           setLoading(false);
//         })
//         .catch(() => setLoading(false));
//     }
//   }, []);

//   // ✅ Save whenever updated
//   useEffect(() => {
//     if (courses.length > 0)
//       localStorage.setItem("courses_data", JSON.stringify(courses));
//   }, [courses]);

//   if (loading) return <LoadingState />;

//   const getLevelColor = (level) => {
//     switch (level) {
//       case "Beginner":
//         return "bg-green-100 text-green-800";
//       case "Intermediate":
//         return "bg-yellow-100 text-yellow-800";
//       case "Advanced":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   /** ✅ Admin adds a course **/
//   const handleAddCourse = (e) => {
//     e.preventDefault();
//     const newEntry = {
//       id: Date.now(),
//       title: newCourse.title,
//       description: newCourse.description,
//       duration: newCourse.duration,
//       instructor: user.name,
//       students: [],
//       level: newCourse.level,
//       color: newCourse.color,
//     };
//     setCourses([...courses, newEntry]);
//     setShowAddModal(false);
//     setNewCourse({ title: "", description: "", duration: "", level: "Beginner", color: "bg-indigo-500" });
//     setToast({ show: true, message: "Course added successfully!", type: "success" });
//   };

//   /** ✅ Student joins a course **/
//   const handleJoinCourse = (courseId) => {
//     const updated = courses.map((c) =>
//       c.id === courseId
//         ? {
//             ...c,
//             students: c.students.includes(user.name)
//               ? c.students
//               : [...c.students, user.name],
//           }
//         : c
//     );
//     setCourses(updated);
//     setToast({ show: true, message: "Joined course successfully!", type: "success" });
//   };

//   /** ✅ Manage students (admin) - Opens modal **/
//   const handleManage = (course) => {
//     setShowManageModal(course);
//   };

//   /** ✅ Remove student from course **/
//   const handleRemoveStudent = (courseId, studentName) => {
//     const updated = courses.map((c) =>
//       c.id === courseId
//         ? {
//             ...c,
//             students: c.students.filter((s) => s !== studentName),
//           }
//         : c
//     );
//     setCourses(updated);
    
//     // Update the modal with the latest course data
//     const updatedCourse = updated.find((c) => c.id === courseId);
//     setShowManageModal(updatedCourse);
    
//     setToast({ show: true, message: `${studentName} removed from course`, type: "success" });
//   };

//   /** ✅ Delete course (admin only) **/
//   const handleDeleteCourse = (courseId) => {
//     const updated = courses.filter((c) => c.id !== courseId);
//     setCourses(updated);
//     setShowDeleteConfirm(null);
//     setShowManageModal(null);
//     setToast({ show: true, message: "Course deleted successfully!", type: "success" });
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Navbar user={user} onLogout={logout} />

//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
//               <p className="text-gray-600">Manage or join courses below</p>
//             </div>
//             {user.role === "admin" && (
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 + Add Course
//               </button>
//             )}
//           </div>

//           {/* Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {courses.map((course) => (
//               <div
//                 key={course.id}
//                 className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
//               >
//                 <div className={`${course.color} h-32 flex justify-center items-center`}>
//                   <span className="text-white text-2xl font-semibold opacity-90">
//                     {course.title.slice(0, 2)}
//                   </span>
//                 </div>
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-lg font-semibold">{course.title}</h3>
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(
//                         course.level
//                       )}`}
//                     >
//                       {course.level}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                     {course.description}
//                   </p>
//                   <p className="text-xs text-gray-500 mb-3">
//                     Instructor: <span className="font-medium">{course.instructor}</span>
//                   </p>
//                   <p className="text-xs text-gray-500 mb-4">
//                     Students: {course.students.length}
//                   </p>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setShowDetail(course)}
//                       className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-lg"
//                     >
//                       View Details
//                     </button>

//                     {user.role === "admin" ? (
//                       <button
//                         onClick={() => handleManage(course)}
//                         className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg"
//                       >
//                         Manage
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleJoinCourse(course.id)}
//                         disabled={course.students.includes(user.name)}
//                         className={`flex-1 text-sm px-3 py-2 rounded-lg ${
//                           course.students.includes(user.name)
//                             ? "bg-green-100 text-green-700 cursor-not-allowed"
//                             : "bg-indigo-600 text-white hover:bg-indigo-700"
//                         }`}
//                       >
//                         {course.students.includes(user.name)
//                           ? "Joined"
//                           : "Join Course"}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>

//       {/* ✅ Add Course Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Course</h2>
//             <form onSubmit={handleAddCourse} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Course Title"
//                 required
//                 value={newCourse.title}
//                 onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//               <textarea
//                 placeholder="Description"
//                 required
//                 value={newCourse.description}
//                 onChange={(e) =>
//                   setNewCourse({ ...newCourse, description: e.target.value })
//                 }
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Duration (e.g., 8 weeks)"
//                 required
//                 value={newCourse.duration}
//                 onChange={(e) =>
//                   setNewCourse({ ...newCourse, duration: e.target.value })
//                 }
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//               <select
//                 value={newCourse.level}
//                 onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option>Beginner</option>
//                 <option>Intermediate</option>
//                 <option>Advanced</option>
//               </select>

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   Add Course
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ✅ Manage Students Modal (Admin Only) */}
//       {showManageModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">
//               Manage Students - {showManageModal.title}
//             </h2>
            
//             {showManageModal.students.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <p>No students enrolled yet</p>
//               </div>
//             ) : (
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {showManageModal.students.map((student, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
//                   >
//                     <span className="text-gray-800 font-medium">{student}</span>
//                     <button
//                       onClick={() => handleRemoveStudent(showManageModal.id, student)}
//                       className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="mt-6 flex justify-between items-center">
//               <button
//                 onClick={() => setShowDeleteConfirm(showManageModal)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Delete Course
//               </button>
//               <button
//                 onClick={() => setShowManageModal(null)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ View Course Detail Modal */}
//       {showDetail && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-2">{showDetail.title}</h2>
//             <p className="text-sm text-gray-500 mb-4">
//               Instructor: {showDetail.instructor} • Duration: {showDetail.duration}
//             </p>
//             <p className="text-gray-700 mb-4">{showDetail.description}</p>
//             <p className="text-sm text-gray-500">
//               <strong>Students Enrolled:</strong> {showDetail.students.join(", ") || "None"}
//             </p>
//             <div className="text-right mt-6">
//               <button
//                 onClick={() => setShowDetail(null)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                 <svg
//                   className="h-6 w-6 text-red-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Course</h3>
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to delete <strong>"{showDeleteConfirm.title}"</strong>? 
//                 This action cannot be undone and will remove all {showDeleteConfirm.students.length} enrolled student(s).
//               </p>
//               <div className="flex gap-3 justify-center">
//                 <button
//                   onClick={() => setShowDeleteConfirm(null)}
//                   className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDeleteCourse(showDeleteConfirm.id)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Delete Course
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast.show && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}
//     </>
//   );
// }

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import LoadingState from "../components/Loadingstate";
import Toast from "../components/Toast";

export default function CoursesPage() {
  const { user, logout } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showManageModal, setShowManageModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    color: "bg-indigo-500",
  });

  // ✅ Load courses from localStorage or JSON file
  useEffect(() => {
    const saved = localStorage.getItem("courses_data");
    if (saved) {
      setCourses(JSON.parse(saved));
      setLoading(false);
    } else {
      fetch("/src/data/course.json")
        .then((res) => res.json())
        .then((data) => {
          setCourses(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  // ✅ Save whenever updated
  useEffect(() => {
    if (courses.length > 0)
      localStorage.setItem("courses_data", JSON.stringify(courses));
  }, [courses]);

  if (loading) return <LoadingState />;

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /** ✅ Admin adds a course **/
  const handleAddCourse = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      title: newCourse.title,
      description: newCourse.description,
      duration: newCourse.duration,
      instructor: user.name,
      students: [],
      level: newCourse.level,
      color: newCourse.color,
    };
    setCourses([...courses, newEntry]);
    setShowAddModal(false);
    setNewCourse({ title: "", description: "", duration: "", level: "Beginner", color: "bg-indigo-500" });
    setToast({ show: true, message: "Course added successfully!", type: "success" });
  };

  /** ✅ Student joins a course **/
  const handleJoinCourse = (courseId) => {
    const updated = courses.map((c) =>
      c.id === courseId
        ? {
            ...c,
            students: c.students.includes(user.name)
              ? c.students
              : [...c.students, user.name],
          }
        : c
    );
    setCourses(updated);
    setToast({ show: true, message: "Joined course successfully!", type: "success" });
  };

  /** ✅ Manage students (admin) - Opens modal **/
  const handleManage = (course) => {
    setShowManageModal(course);
  };

  /** ✅ Remove student from course **/
  const handleRemoveStudent = (courseId, studentName) => {
    const updated = courses.map((c) =>
      c.id === courseId
        ? {
            ...c,
            students: c.students.filter((s) => s !== studentName),
          }
        : c
    );
    setCourses(updated);
    
    // Update the modal with the latest course data
    const updatedCourse = updated.find((c) => c.id === courseId);
    setShowManageModal(updatedCourse);
    
    setToast({ show: true, message: `${studentName} removed from course`, type: "success" });
  };

  /** ✅ Delete course (admin only) **/
  const handleDeleteCourse = (courseId) => {
    const updated = courses.filter((c) => c.id !== courseId);
    setCourses(updated);
    setShowDeleteConfirm(null);
    setShowManageModal(null);
    setToast({ show: true, message: "Course deleted successfully!", type: "success" });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar user={user} onLogout={logout} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600">Manage or join courses below</p>
            </div>
            {user.role === "admin" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                + Add Course
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className={`${course.color} h-32 flex justify-center items-center`}>
                  <span className="text-white text-2xl font-semibold opacity-90">
                    {course.title.slice(0, 2)}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(
                        course.level
                      )}`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Instructor: <span className="font-medium">{course.instructor}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Students: {course.students.length}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDetail(course)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-lg"
                    >
                      View Details
                    </button>

                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleManage(course)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg"
                      >
                        Manage
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinCourse(course.id)}
                        disabled={course.students.includes(user.name)}
                        className={`flex-1 text-sm px-3 py-2 rounded-lg ${
                          course.students.includes(user.name)
                            ? "bg-green-100 text-green-700 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {course.students.includes(user.name)
                          ? "Joined"
                          : "Join Course"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ✅ Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                required
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Description"
                required
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 8 weeks)"
                required
                value={newCourse.duration}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, duration: e.target.value })
                }
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Manage Students Modal (Admin Only) */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Manage Students - {showManageModal.title}
            </h2>
            
            {showManageModal.students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No students enrolled yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {showManageModal.students.map((student, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <span className="text-gray-800 font-medium">{student}</span>
                    <button
                      onClick={() => handleRemoveStudent(showManageModal.id, student)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setShowDeleteConfirm(showManageModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Course
              </button>
              <button
                onClick={() => setShowManageModal(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ View Course Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{showDetail.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Instructor: {showDetail.instructor} • Duration: {showDetail.duration}
            </p>
            <p className="text-gray-700 mb-4">{showDetail.description}</p>
            <p className="text-sm text-gray-500">
              <strong>Students Enrolled:</strong> {showDetail.students.join(", ") || "None"}
            </p>
            <div className="text-right mt-6">
              <button
                onClick={() => setShowDetail(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Course</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{showDeleteConfirm.title}"</strong>? 
                This action cannot be undone and will remove all {showDeleteConfirm.students.length} enrolled student(s).
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCourse(showDeleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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