
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    GraduationCap,
    Users,
    Layers,
    BookOpen,
    CalendarDays,
    UserRound,
    CheckCircle,
    XCircle,
    School,
} from "lucide-react";

const ClassDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Receive class data from ClassDashboard
    const classData = location.state?.classData;

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

    // Handle missing class data
    if (!classData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <GraduationCap
                        size={48}
                        className="mx-auto mb-4 text-gray-400"
                    />

                    <h2 className="text-xl font-bold text-gray-800">
                        No Class Selected
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Please select a class from the Classes Dashboard to
                        view its details.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Classes
                    </button>
                </div>
            </div>
        );
    }

    const sections = getSections(classData.section);

    const isActive =
        String(classData.classstatus || "").toLowerCase() === "active";

    const className =
        classData.classname || classData.grade || "Unnamed Class";

    const classTeacher =
        typeof classData.classteacher === "object"
            ? classData.classteacher?.name ||
            classData.classteacher?.firstName ||
            "Not assigned"
            : classData.classteacher || "Not assigned";

    const studentCapacity = Number(classData.studentcapacity) || 0;

    // Student count and subjects are not provided by this class API
    const enrolledStudents =
        classData.students == null
            ? null
            : Number(classData.students) || 0;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Back Button */}
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
            >
                <ArrowLeft size={18} />
                Back to Classes
            </button>

            {/* Class Header */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-md sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                            <GraduationCap size={36} />
                        </div>

                        <div>
                            <p className="mb-1 text-sm text-blue-100">
                                Class Details
                            </p>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {className}
                            </h1>

                            <p className="mt-2 text-sm text-blue-100">
                                Grade: {classData.grade || "N/A"}
                                {" "}• Academic Year:{" "}
                                {classData.acdemicyear ?? "N/A"}
                            </p>
                        </div>
                    </div>

                    <div>
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-white/20 text-white"
                                }`}
                        >
                            {isActive ? (
                                <CheckCircle size={17} />
                            ) : (
                                <XCircle size={17} />
                            )}

                            {classData.classstatus || "Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                    title="Class Capacity"
                    value={studentCapacity}
                    description="Maximum students"
                    icon={<Users size={24} />}
                    color="blue"
                />

                <InfoCard
                    title="Total Sections"
                    value={sections.length}
                    description="Sections in this class"
                    icon={<Layers size={24} />}
                    color="purple"
                />

                <InfoCard
                    title="Enrolled Students"
                    value={enrolledStudents ?? "N/A"}
                    description={
                        enrolledStudents == null
                            ? "Not provided by class API"
                            : "Currently enrolled"
                    }
                    icon={<School size={24} />}
                    color="green"
                />

                <InfoCard
                    title="Academic Year"
                    value={classData.acdemicyear ?? "N/A"}
                    description="Current class year"
                    icon={<CalendarDays size={24} />}
                    color="orange"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Class Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                            <School size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Class Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Basic information about this class
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <DetailRow
                            label="Class Name"
                            value={classData.classname}
                        />

                        <DetailRow
                            label="Grade"
                            value={classData.grade}
                        />

                        <DetailRow
                            label="Academic Year"
                            value={classData.acdemicyear}
                        />

                        <DetailRow
                            label="Student Capacity"
                            value={classData.studentcapacity}
                        />

                        <DetailRow
                            label="Class Status"
                            value={classData.classstatus}
                        />

                        <DetailRow
                            label="Class ID"
                            value={classData._id}
                        />
                    </div>
                </div>

                {/* Class Teacher */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-green-100 p-3 text-green-600">
                            <UserRound size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Class Teacher
                            </h2>

                            <p className="text-sm text-gray-500">
                                Teacher assigned to this class
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                                <UserRound size={28} />
                            </div>

                            <div>
                                <p className="font-bold text-gray-800">
                                    {classTeacher}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Assigned Class Teacher
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <DetailRow
                            label="Class"
                            value={className}
                        />

                        <DetailRow
                            label="Academic Year"
                            value={classData.acdemicyear}
                        />
                    </div>
                </div>

                {/* Sections */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                            <Layers size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Sections
                            </h2>

                            <p className="text-sm text-gray-500">
                                Sections available in {className}
                            </p>
                        </div>
                    </div>

                    {sections.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {sections.map((section, index) => (
                                <div
                                    key={`${section}-${index}`}
                                    className="rounded-xl border border-purple-100 bg-purple-50 p-5 text-center transition hover:border-purple-300 hover:shadow-sm"
                                >
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-lg font-bold text-purple-700">
                                        {section}
                                    </div>

                                    <p className="font-semibold text-gray-800">
                                        Section {section}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Part of {className}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No sections have been added to this class." />
                    )}
                </div>

                {/* Subjects */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <BookOpen size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Subjects
                            </h2>

                            <p className="text-sm text-gray-500">
                                Subjects assigned to this class
                            </p>
                        </div>
                    </div>

                    {Array.isArray(classData.subjects) &&
                        classData.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {classData.subjects.map((subject, index) => (
                                <span
                                    key={index}
                                    className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700"
                                >
                                    {typeof subject === "object"
                                        ? subject.name || subject.subjectName
                                        : subject}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Subjects are not available in the current class API response." />
                    )}
                </div>
            </div>

            {/* Students Section */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                        <Users size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Students
                        </h2>

                        <p className="text-sm text-gray-500">
                            Student records for {className}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                    <Users
                        size={35}
                        className="mx-auto mb-3 text-gray-400"
                    />

                    <p className="font-semibold text-gray-700">
                        {enrolledStudents == null
                            ? "Student list not available"
                            : `${enrolledStudents} students enrolled`}
                    </p>

                    <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                        Your current class API returns the class capacity but
                        does not include a list of students. To display actual
                        student records, connect the student API and filter
                        students by their class and section.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Reusable information card
const InfoCard = ({ title, value, description, icon, color }) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h3 className="mt-3 break-words text-2xl font-bold text-gray-800">
                        {value ?? "N/A"}
                    </h3>

                    <p className="mt-2 text-xs text-gray-400">
                        {description}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Reusable detail row
const DetailRow = ({ label, value }) => (
    <div className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-sm text-gray-500">{label}</span>

        <span className="break-all text-sm font-semibold text-gray-800 sm:text-right">
            {value === undefined || value === null || value === ""
                ? "N/A"
                : String(value)}
        </span>
    </div>
);

// Empty state
const EmptyState = ({ message }) => (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
        <BookOpen size={32} className="mx-auto mb-3 text-gray-400" />

        <p className="text-sm text-gray-500">{message}</p>
    </div>
);

export default ClassDetails;
