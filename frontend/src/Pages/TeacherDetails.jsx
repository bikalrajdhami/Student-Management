
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    UserRound,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    Clock,
    IdCard,
} from "lucide-react";

const TeacherDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const teacher = location.state?.teacher;

    // Reusable information field
    const InfoField = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Icon size={19} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 break-words font-semibold text-gray-800">
                    {value || "N/A"}
                </p>
            </div>
        </div>
    );

    // Handle missing teacher data
    if (!teacher) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <UserRound size={30} className="text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">
                        Teacher Not Found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Teacher information is unavailable. Please return to
                        the teachers list and select a teacher.
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const fullName =
        `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
        "Teacher";

    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-blue-600"
                >
                    <ArrowLeft size={19} />
                    Back to Teachers
                </button>

                {/* Teacher Profile Header */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="h-2 bg-blue-600" />

                    <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <UserRound size={42} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Teacher Profile
                            </p>

                            <h1 className="mt-1 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                                {fullName}
                            </h1>

                            <p className="mt-2 break-words text-gray-500">
                                {teacher.email || "No email available"}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    Teacher {teacher.status}
                                </span>

                                {teacher.designation && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                                        <BriefcaseBusiness size={15} />
                                        {teacher.designation}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Cards */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Personal Information */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <UserRound size={22} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Personal Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Teacher's contact and personal details
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">

                            <InfoField
                                icon={UserRound}
                                label="First Name"
                                value={teacher.firstName}
                            />

                            <InfoField
                                icon={UserRound}
                                label="Last Name"
                                value={teacher.lastName}
                            />

                            <InfoField
                                icon={Mail}
                                label="Email Address"
                                value={teacher.email}
                            />

                            <InfoField
                                icon={Phone}
                                label="Phone Number"
                                value={teacher.phone}
                            />

                            <div className="sm:col-span-2">
                                <InfoField
                                    icon={MapPin}
                                    label="Residential Address"
                                    value={teacher.address}
                                />
                            </div>

                        </div>
                    </section>

                    {/* Professional Information */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                    <BriefcaseBusiness size={22} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Professional Information
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Teacher's employment and academic details
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">

                            <InfoField
                                icon={GraduationCap}
                                label="Qualification"
                                value={teacher.qualification}
                            />

                            <InfoField
                                icon={BookOpen}
                                label="Teaching Subject"
                                value={teacher.specialization}
                            />

                            <InfoField
                                icon={BriefcaseBusiness}
                                label="Designation"
                                value={teacher.department}
                            />

                            <InfoField
                                icon={CalendarDays}
                                label="Joining Date"
                                value={formatDate(teacher.joiningDate)}
                            />

                            <InfoField
                                icon={IdCard}
                                label="Teaching Sujects"
                                value={teacher.subjects}
                            />

                            <InfoField
                                icon={IdCard}
                                label="Classes"
                                value={teacher.classes}
                            />


                            <InfoField
                                icon={Clock}
                                label="Experience"
                                value={
                                    teacher.experience
                                        ? `${teacher.experience} years`
                                        : "N/A"
                                }
                            />

                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-4">
                    <p className="text-center text-sm text-gray-500">
                        Teacher Management System
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TeacherDetails;

