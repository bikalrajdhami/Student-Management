import React, { useEffect, useState } from "react";
import { Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteStudent, getStudents } from "../api/studentApi";

const StudentsTable = () => {
    const [students, setStudents] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const navigate = useNavigate();

    // Get students
    const fetchStudents = async () => {
        try {
            const response = await getStudents();
            setStudents(response.data.students);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Edit student
    const handleEdit = (student) => {
        navigate("/add-student", {
            state: { student }
        });
    };

    // Show delete popup
    const handleDelete = (id) => {
        setSelectedStudentId(id);
        setShowDeletePopup(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        try {
            await deleteStudent(selectedStudentId);

            setStudents(
                students.filter(
                    (student) => student._id !== selectedStudentId
                )
            );

            setShowDeletePopup(false);
            setSelectedStudentId(null);
        } catch (error) {
            console.log(error);
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setShowDeletePopup(false);
        setSelectedStudentId(null);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">

            <h2 className="text-2xl font-bold text-gray-800">
                Students List
            </h2>

            <p className="text-gray-500 mt-1 mb-5">
                List of all students
            </p>

            <div className="overflow-x-auto">

                <table className="w-full text-left">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4">S.N.</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Class</th>
                            <th className="px-6 py-4">Section</th>
                            <th className="px-6 py-4">Parent Name</th>
                            <th className="px-6 py-4">Parent Phone</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No students found
                                </td>
                            </tr>
                        ) : (
                            students.map((student, index) => (
                                <tr
                                    key={student._id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4 font-medium">
                                        {student.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        Class {student.class}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.section}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.parentname}
                                    </td>

                                    <td className="px-6 py-4">
                                        {student.parentphone}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex gap-2">

                                            {/* Edit */}
                                            <button
                                                onClick={() =>
                                                    handleEdit(student)
                                                }
                                                className="flex items-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(student._id)
                                                }
                                                className="flex items-center gap-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>

                                        </div>

                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

            {/* Delete Confirmation Modal */}
            {showDeletePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6">

                        {/* Close Button */}
                        <button
                            onClick={cancelDelete}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={22} />
                        </button>

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle
                                    size={28}
                                    className="text-red-600"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-center text-gray-800">
                            Delete Student?
                        </h3>

                        {/* Message */}
                        <p className="text-center text-gray-500 mt-2">
                            Are you sure you want to delete this student?
                            This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center gap-3 mt-6">

                            {/* Cancel */}
                            <button
                                onClick={cancelDelete}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            {/* Confirm Delete */}
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete Student
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default StudentsTable;