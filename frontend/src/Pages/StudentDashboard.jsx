import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Users,
    GraduationCap,
    Layers,
    Phone,
    Eye,
    Pencil,
    Trash2,
    X,
    AlertTriangle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getStudents, deleteStudent } from "../api/studentApi";

const StudentDashboard = () => {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Delete popup states
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch students from API
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await getStudents();

            setStudents(response.data.students || []);
        } catch (error) {
            console.error("Error fetching students:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load students. Please check your backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Search students
    const filteredStudents = students.filter((student) => {
        const searchableText = [
            student.name,
            student.email,
            student.class,
            student.section,
            student.address,
            student.parentname,
            student.parentphone,
        ]
            .map((value) => String(value ?? ""))
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm.toLowerCase());
    });

    // Dashboard statistics
    const totalStudents = students.length;

    const totalClasses = new Set(
        students.map((student) => student.class).filter(Boolean)
    ).size;

    const totalSections = new Set(
        students
            .filter((student) => student.class && student.section)
            .map((student) => `${student.class}-${student.section}`)
    ).size;

    const parentContacts = students.filter(
        (student) => student.parentphone
    ).length;

    // Navigate to Add Student page
    const handleAddStudent = () => {
        navigate("/add-student");
    };

    // Navigate to Student Details page
    const handleViewDetails = (student) => {
        navigate("/student-details", {
            state: { student },
        });
    };

    // Navigate to Edit Student page
    const handleEditStudent = (student) => {
        navigate("/add-student", {
            state: { student },
        });
    };

    // Open delete popup
    const handleDelete = (id) => {
        setSelectedStudentId(id);
        setShowDeletePopup(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!selectedStudentId || deleting) return;

        try {
            setDeleting(true);

            await deleteStudent(selectedStudentId);

            setStudents((previousStudents) =>
                previousStudents.filter(
                    (student) => student._id !== selectedStudentId
                )
            );

            setShowDeletePopup(false);
            setSelectedStudentId(null);
            setErrorMessage("");
        } catch (error) {
            console.error("Error deleting student:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to delete student. Please try again."
            );

            setShowDeletePopup(false);
            setSelectedStudentId(null);
        } finally {
            setDeleting(false);
        }
    };

    // Close delete popup
    const closeDeletePopup = () => {
        if (deleting) return;

        setShowDeletePopup(false);
        setSelectedStudentId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Students Management
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage students, classes, sections, and student records.
                    </p>
                </div>

                {/* Add Student Button */}
                <button
                    type="button"
                    onClick={handleAddStudent}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add New Student
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total Students"
                    value={totalStudents}
                    description="Registered students"
                    icon={<Users size={24} />}
                    iconColor="bg-blue-100 text-blue-600"
                />

                <SummaryCard
                    title="Total Classes"
                    value={totalClasses}
                    description="Classes with students"
                    icon={<GraduationCap size={24} />}
                    iconColor="bg-green-100 text-green-600"
                />

                <SummaryCard
                    title="Class Sections"
                    value={totalSections}
                    description="Class and section combinations"
                    icon={<Layers size={24} />}
                    iconColor="bg-purple-100 text-purple-600"
                />

                <SummaryCard
                    title="Parent Contacts"
                    value={parentContacts}
                    description="Students with parent phone numbers"
                    icon={<Phone size={24} />}
                    iconColor="bg-orange-100 text-orange-600"
                />
            </div>

            {/* Students Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            All Students
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage registered students.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}

                        <button
                            type="button"
                            onClick={fetchStudents}
                            className="ml-3 font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Student
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Class
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Section
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Email
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Parent Phone
                                </th>

                                <th className="px-6 py-4 text-center font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        Loading students...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student._id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            {/* Student Name */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                                        {(student.name || "S")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {student.name ||
                                                                "Unnamed Student"}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {student.address ||
                                                                "Address not provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Class */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.class
                                                    ? `Class ${student.class}`
                                                    : "Not assigned"}
                                            </td>

                                            {/* Section */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.section ||
                                                    "Not assigned"}
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.email || "N/A"}
                                            </td>

                                            {/* Parent Phone */}
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {student.parentphone || "N/A"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                student
                                                            )
                                                        }
                                                        title="View Details"
                                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditStudent(student)}
                                                        title="Edit Student"
                                                        className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                student._id
                                                            )
                                                        }
                                                        title="Delete Student"
                                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center"
                                            >
                                                <Search
                                                    size={35}
                                                    className="mx-auto mb-3 text-gray-300"
                                                />

                                                <p className="font-semibold text-gray-700">
                                                    No students found
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try another search or add a
                                                    new student.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
                    Showing {loading ? 0 : filteredStudents.length} of{" "}
                    {loading ? 0 : students.length} students
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={closeDeletePopup}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-student-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeDeletePopup}
                                disabled={deleting}
                                aria-label="Close popup"
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle
                                size={32}
                                className="text-red-600"
                            />
                        </div>

                        <div className="text-center">
                            <h2
                                id="delete-student-title"
                                className="text-xl font-bold text-gray-800"
                            >
                                Delete Student?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Are you sure you want to delete this student?
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={closeDeletePopup}
                                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 sm:flex-1"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={confirmDelete}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                            >
                                <Trash2 size={17} />
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable Statistics Card
const SummaryCard = ({
    title,
    value,
    description,
    icon,
    iconColor,
}) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">
                    {title}
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-800">
                    {value}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                    {description}
                </p>
            </div>

            <div className={`rounded-xl p-3 ${iconColor}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default StudentDashboard;