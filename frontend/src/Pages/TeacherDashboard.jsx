
import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Users,
    UserCheck,
    UserX,
    GraduationCap,
    Eye,
    Pencil,
    Trash2,
    X,
    AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getTeachers,
    deleteTeacher,
} from "../api/teacherApi";

const TeacherDashboard = () => {
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Delete popup states
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch teachers
    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await getTeachers();

            setTeachers(response.data.teacher || []);
        } catch (error) {
            console.error("Error fetching teachers:", error);

            setErrorMessage(
                error.response?.data?.message ||
                    "Unable to load teachers. Please check your backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Search teachers
    const filteredTeachers = teachers.filter((teacher) => {
        const searchableText = [
            teacher.teacherID,
            teacher.teacherId,
            teacher.firstName,
            teacher.lastName,
            teacher.email,
            teacher.phone,
            teacher.department,
            teacher.departement,
            teacher.specialization,
            teacher.status,
        ]
            .map((value) => String(value ?? ""))
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm.toLowerCase());
    });

    // Dashboard statistics
    const totalTeachers = teachers.length;

    const activeTeachers = teachers.filter(
        (teacher) =>
            String(teacher.status || "").toLowerCase() === "active"
    ).length;

    const inactiveTeachers = totalTeachers - activeTeachers;

    const departments = new Set(
        teachers
            .map((teacher) => teacher.department || teacher.departement)
            .filter(Boolean)
    ).size;

    // Teacher full name
    const getTeacherName = (teacher) =>
        `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
        "Unnamed Teacher";

    // Navigate to Add Teacher page
    const handleAddTeacher = () => {
        navigate("/addteacher");
    };

    // Navigate to Teacher Details page
    const handleViewDetails = (teacher) => {
        navigate("/teacher-details", {
            state: { teacher },
        });
    };

    // Navigate to Edit Teacher page
    const handleEditTeacher = (teacher) => {
        navigate("/addteacher", {
            state: { teacher },
        });
    };

    // Open delete popup
    const handleDelete = (id) => {
        setSelectedTeacherId(id);
        setShowDeletePopup(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!selectedTeacherId || deleting) return;

        try {
            setDeleting(true);

            await deleteTeacher(selectedTeacherId);

            setTeachers((previousTeachers) =>
                previousTeachers.filter(
                    (teacher) => teacher._id !== selectedTeacherId
                )
            );

            setShowDeletePopup(false);
            setSelectedTeacherId(null);
            setErrorMessage("");
        } catch (error) {
            console.error("Error deleting teacher:", error);

            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to delete teacher. Please try again."
            );

            setShowDeletePopup(false);
            setSelectedTeacherId(null);
        } finally {
            setDeleting(false);
        }
    };

    // Close popup
    const closeDeletePopup = () => {
        if (deleting) return;

        setShowDeletePopup(false);
        setSelectedTeacherId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Teachers Management
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage teachers, departments, and employment records.
                    </p>
                </div>

                {/* Add Teacher Button */}
                <button
                    type="button"
                    onClick={handleAddTeacher}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add New Teacher
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total Teachers"
                    value={totalTeachers}
                    description="Registered teachers"
                    icon={<Users size={24} />}
                    iconColor="bg-blue-100 text-blue-600"
                />

                <SummaryCard
                    title="Active Teachers"
                    value={activeTeachers}
                    description="Currently active"
                    icon={<UserCheck size={24} />}
                    iconColor="bg-green-100 text-green-600"
                />

                <SummaryCard
                    title="Inactive Teachers"
                    value={inactiveTeachers}
                    description="Not currently active"
                    icon={<UserX size={24} />}
                    iconColor="bg-red-100 text-red-600"
                />

                <SummaryCard
                    title="Departments"
                    value={departments}
                    description="Departments represented"
                    icon={<GraduationCap size={24} />}
                    iconColor="bg-purple-100 text-purple-600"
                />
            </div>

            {/* Teachers Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            All Teachers
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage registered teachers.
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search teachers..."
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
                            onClick={fetchTeachers}
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
                                    Teacher
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Teacher ID
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Contact
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Department
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Qualification
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Status
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
                                        colSpan="7"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        Loading teachers...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredTeachers.map((teacher) => {
                                        const isActive =
                                            String(
                                                teacher.status || ""
                                            ).toLowerCase() === "active";

                                        return (
                                            <tr
                                                key={teacher._id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                                            {getTeacherName(
                                                                teacher
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-800">
                                                                {getTeacherName(
                                                                    teacher
                                                                )}
                                                            </p>

                                                            <p className="text-xs text-gray-500">
                                                                {teacher.gender ||
                                                                    "Gender not specified"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {teacher.teacherID ||
                                                        teacher.teacherId ||
                                                        "N/A"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        {teacher.email || "N/A"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {teacher.phone || "N/A"}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {teacher.department ||
                                                        teacher.departement ||
                                                        "Not assigned"}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {teacher.qualification ||
                                                        "N/A"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            isActive
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {teacher.status ||
                                                            "Inactive"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    teacher
                                                                )
                                                            }
                                                            title="View Details"
                                                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditTeacher(
                                                                    teacher
                                                                )
                                                            }
                                                            title="Edit Teacher"
                                                            className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    teacher._id
                                                                )
                                                            }
                                                            title="Delete Teacher"
                                                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredTeachers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center"
                                            >
                                                <Search
                                                    size={35}
                                                    className="mx-auto mb-3 text-gray-300"
                                                />

                                                <p className="font-semibold text-gray-700">
                                                    No teachers found
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try another search or add a
                                                    new teacher.
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
                    Showing {loading ? 0 : filteredTeachers.length} of{" "}
                    {loading ? 0 : teachers.length} teachers
                </div>
            </div>

            {/* Centered Delete Popup */}
            {showDeletePopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={closeDeletePopup}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-teacher-title"
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
                                id="delete-teacher-title"
                                className="text-xl font-bold text-gray-800"
                            >
                                Delete Teacher?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Are you sure you want to delete this teacher?
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

export default TeacherDashboard;
