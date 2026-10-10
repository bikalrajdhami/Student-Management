
import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassDashboard = () => {
    const navigate = useNavigate();

    // Sample data for frontend design
    const [classes, setClasses] = useState([
        {
            _id: "1",
            className: "Nursery",
            grade: "Nursery",
            academicYear: "2026",
            sections: ["A", "B"],
            students: 38,
            classTeacher: "Sita Sharma",
            capacity: 40,
            status: "Active",
        },
        {
            _id: "2",
            className: "LKG",
            grade: "LKG",
            academicYear: "2026",
            sections: ["A", "B"],
            students: 42,
            classTeacher: "Gita Rai",
            capacity: 45,
            status: "Active",
        },
        {
            _id: "3",
            className: "UKG",
            grade: "UKG",
            academicYear: "2026",
            sections: ["A", "B"],
            students: 40,
            classTeacher: "Ramesh Karki",
            capacity: 45,
            status: "Active",
        },
        {
            _id: "4",
            className: "Class 1",
            grade: "1",
            academicYear: "2026",
            sections: ["A", "B", "C"],
            students: 65,
            classTeacher: "Mina Thapa",
            capacity: 70,
            status: "Active",
        },
        {
            _id: "5",
            className: "Class 2",
            grade: "2",
            academicYear: "2026",
            sections: ["A", "B"],
            students: 48,
            classTeacher: "Hari Karki",
            capacity: 50,
            status: "Active",
        },
        {
            _id: "6",
            className: "Class 3",
            grade: "3",
            academicYear: "2026",
            sections: ["A", "B"],
            students: 0,
            classTeacher: "Not assigned",
            capacity: 50,
            status: "Inactive",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    // Search classes
    const filteredClasses = classes.filter((item) =>
        `${item.className} ${item.classTeacher} ${item.academicYear}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Dashboard statistics
    const totalClasses = classes.length;

    const totalSections = classes.reduce(
        (total, item) => total + item.sections.length,
        0
    );

    const totalStudents = classes.reduce(
        (total, item) => total + item.students,
        0
    );

    // Delete class
    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this class?"
        );

        if (!confirmDelete) return;

        setClasses((previousClasses) =>
            previousClasses.filter((item) => item._id !== id)
        );
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
                    onClick={()=> navigate("/add-class")}
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
                    description="Students across classes"
                    icon={<Users size={24} />}
                    iconColor="bg-green-100 text-green-600"
                />

                <SummaryCard
                    title="Active Classes"
                    value={classes.filter((item) => item.status === "Active").length}
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

                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Class</th>
                                <th className="px-6 py-4 font-semibold">
                                    Academic Year
                                </th>
                                <th className="px-6 py-4 font-semibold">Sections</th>
                                <th className="px-6 py-4 font-semibold">Students</th>
                                <th className="px-6 py-4 font-semibold">
                                    Class Teacher
                                </th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 text-center font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredClasses.map((item) => (
                                <tr
                                    key={item._id}
                                    className="transition hover:bg-gray-50"
                                >
                                    {/* Class Name */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                                                {item.className.startsWith("Class")
                                                    ? item.grade
                                                    : item.className.charAt(0)}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {item.className}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Capacity: {item.capacity}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Academic Year */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.academicYear}
                                    </td>

                                    {/* Sections */}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1.5">
                                            {item.sections.map((section) => (
                                                <span
                                                    key={section}
                                                    className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700"
                                                >
                                                    {section}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Students */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-800">
                                            {item.students}
                                        </span>
                                        <span className="text-gray-400">
                                            {" "}/ {item.capacity}
                                        </span>
                                    </td>

                                    {/* Class Teacher */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.classTeacher}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleViewDetails(item)
                                                }
                                                title="View Details"
                                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate("/add-class", {
                                                        state: { classData: item },
                                                    })
                                                }
                                                title="Edit Class"
                                                className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                                title="Delete Class"
                                                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

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
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
                    Showing {filteredClasses.length} of {classes.length} classes
                </div>
            </div>
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
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="mt-3 text-3xl font-bold text-gray-800">
                        {value}
                    </h3>
                    <p className="mt-2 text-xs text-gray-400">{description}</p>
                </div>

                <div className={`rounded-xl p-3 ${iconColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default ClassDashboard;

