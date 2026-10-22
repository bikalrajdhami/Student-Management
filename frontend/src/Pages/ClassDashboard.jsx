
import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    GraduationCap,
    Users,
    BookOpen,
    Layers,
    Eye,
    Pencil,
    Trash2,
    X,
    AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getclass, deleteclass } from "../api/classApi";

const ClassDashboard = () => {
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Delete popup states
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Convert section string into an array
    const getSections = (section) => {
        if (Array.isArray(section)) {
            return section
                .map((item) =>
                    typeof item === "object"
                        ? item?.name || item?.sectionName || ""
                        : String(item)
                )
                .map((item) => item.trim())
                .filter(Boolean);
        }

        if (typeof section === "string") {
            return section
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    };

    // Fetch classes from backend
    const fetchClasses = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await getclass();

            console.log("Fetched classes:", response.data);

            setClasses(response.data.classes || []);
        } catch (error) {
            console.error(
                "Error fetching classes:",
                error.response?.data || error.message
            );

            setErrorMessage(
                error.response?.data?.message ||
                    "Unable to load classes. Please check your backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Search classes
    const filteredClasses = classes.filter((item) => {
        const searchableText = [
            item.classname,
            item.grade,
            item.acdemicyear,
            item.classteacher,
            item.section,
            item.classstatus,
        ]
            .map((value) => String(value ?? ""))
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchTerm.toLowerCase());
    });

    // Dashboard statistics
    const totalClasses = classes.length;

    const totalSections = classes.reduce(
        (total, item) => total + getSections(item.section).length,
        0
    );

    // Student count is not currently returned by your API
    const totalStudents = classes.reduce(
        (total, item) => total + (Number(item.students) || 0),
        0
    );

    const activeClasses = classes.filter(
        (item) =>
            String(item.classstatus || "").toLowerCase() === "active"
    ).length;

    // Open centered delete popup
    const handleDelete = (id) => {
        setSelectedClassId(id);
        setShowDeletePopup(true);
    };

    // Confirm deletion through API
    const confirmDelete = async () => {
        if (!selectedClassId || deleting) return;

        try {
            setDeleting(true);

            await deleteclass(selectedClassId);

            setClasses((previousClasses) =>
                previousClasses.filter(
                    (item) => item._id !== selectedClassId
                )
            );

            setShowDeletePopup(false);
            setSelectedClassId(null);
            setErrorMessage("");
        } catch (error) {
            console.error(
                "Error deleting class:",
                error.response?.data || error.message
            );

            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to delete class. Please try again."
            );

            setShowDeletePopup(false);
            setSelectedClassId(null);
        } finally {
            setDeleting(false);
        }
    };

    // Close delete popup
    const closeDeletePopup = () => {
        if (deleting) return;

        setShowDeletePopup(false);
        setSelectedClassId(null);
    };

    // Open class details
    const handleViewDetails = (classData) => {
        navigate("/class-details", {
            state: { classData },
        });
    };

    // Open add class page
    const handleAddClass = () => {
        navigate("/add-class");
    };

    // Open the same form with existing class data for editing
    const handleEditClass = (classData) => {
        navigate("/add-class", {
            state: { classData },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Classes Management
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage classes, sections, students, and class teachers.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddClass}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add New Class
                </button>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total Classes"
                    value={totalClasses}
                    description="Classes in the system"
                    icon={<GraduationCap size={24} />}
                    iconColor="bg-blue-100 text-blue-600"
                />

                <SummaryCard
                    title="Total Sections"
                    value={totalSections}
                    description="Sections across classes"
                    icon={<Layers size={24} />}
                    iconColor="bg-purple-100 text-purple-600"
                />

                <SummaryCard
                    title="Total Students"
                    value={totalStudents}
                    description="Enrolled students"
                    icon={<Users size={24} />}
                    iconColor="bg-green-100 text-green-600"
                />

                <SummaryCard
                    title="Active Classes"
                    value={activeClasses}
                    description="Currently active"
                    icon={<BookOpen size={24} />}
                    iconColor="bg-orange-100 text-orange-600"
                />
            </div>

            {/* Classes Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            All Classes
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage all school classes.
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search classes..."
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
                            onClick={fetchClasses}
                            className="ml-3 font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Class</th>
                                <th className="px-6 py-4 font-semibold">Academic Year</th>
                                <th className="px-6 py-4 font-semibold">Sections</th>
                                <th className="px-6 py-4 font-semibold">Students</th>
                                <th className="px-6 py-4 font-semibold">Class Teacher</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        Loading classes...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredClasses.map((classData) => {
                                        const sections = getSections(classData.section);

                                        const isActive =
                                            String(classData.classstatus || "")
                                                .toLowerCase() === "active";

                                        return (
                                            <tr
                                                key={classData._id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                {/* Class Name */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                                                            {(
                                                                classData.classname ||
                                                                classData.grade ||
                                                                "C"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-800">
                                                                {classData.classname ||
                                                                    classData.grade ||
                                                                    "N/A"}
                                                            </p>

                                                            <p className="text-xs text-gray-500">
                                                                Capacity:{" "}
                                                                {classData.studentcapacity ?? "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Academic Year */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {classData.acdemicyear ?? "N/A"}
                                                </td>

                                                {/* Sections */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {sections.length > 0 ? (
                                                            sections.map((section, index) => (
                                                                <span
                                                                    key={`${section}-${index}`}
                                                                    className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700"
                                                                >
                                                                    {section}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-400">
                                                                No sections
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Students */}
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-800">
                                                        {Number(classData.students) || 0}
                                                    </span>

                                                    <span className="text-gray-400">
                                                        {" "}/{" "}
                                                        {classData.studentcapacity ?? "N/A"}
                                                    </span>
                                                </td>

                                                {/* Class Teacher */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {typeof classData.classteacher === "object"
                                                        ? classData.classteacher?.name ||
                                                          classData.classteacher?.firstName ||
                                                          "Not assigned"
                                                        : classData.classteacher ||
                                                          "Not assigned"}
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            isActive
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {classData.classstatus || "Inactive"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewDetails(classData)
                                                            }
                                                            title="View Details"
                                                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditClass(classData)
                                                            }
                                                            title="Edit Class"
                                                            className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(classData._id)
                                                            }
                                                            title="Delete Class"
                                                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* No Results */}
                                    {filteredClasses.length === 0 && (
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
                                                    No classes found
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try another search or add a new class.
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
                    Showing {loading ? 0 : filteredClasses.length} of{" "}
                    {loading ? 0 : classes.length} classes
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
                        aria-labelledby="delete-popup-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeDeletePopup}
                                disabled={deleting}
                                aria-label="Close delete confirmation"
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>

                        <div className="text-center">
                            <h2
                                id="delete-popup-title"
                                className="text-xl font-bold text-gray-800"
                            >
                                Delete Class?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Are you sure you want to delete this class?
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

// Reusable Summary Card
const SummaryCard = ({
    title,
    value,
    description,
    icon,
    iconColor,
}) => {
    return (
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
};

export default ClassDashboard;
