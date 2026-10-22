import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    GraduationCap,
    UserRound,
    Mail,
    MapPin,
    Users,
    Phone,
    BookOpen,
    Hash,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";
import { getStudentById } from "../api/studentApi";

const StudentDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [student, setStudent] = useState(location.state?.student || null);
    const [loading, setLoading] = useState(!location.state?.student);
    const [error, setError] = useState("");

    useEffect(() => {
        if (location.state?.student) {
            setStudent(location.state.student);
            setLoading(false);
            return;
        }

        if (!id) {
            setError("Student information was not provided.");
            setLoading(false);
            return;
        }

        const fetchStudent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getStudentById(id);
                setStudent(response.data.student || null);

                if (!response.data.student) {
                    setError("Student not found.");
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load student details. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id, location.state]);

    const handleEdit = () => {
        navigate(`/add-student/${student._id}`, {
            state: { student },
        });
    };

    const detailItems = [
        {
            label: "Student Name",
            value: student?.name,
            icon: UserRound,
        },
        {
            label: "Email Address",
            value: student?.email,
            icon: Mail,
        },
        {
            label: "Class",
            value: student?.class,
            icon: BookOpen,
        },
        {
            label: "Section",
            value: student?.section,
            icon: Hash,
        },
        {
            label: "Address",
            value: student?.address,
            icon: MapPin,
        },
        {
            label: "Parent / Guardian",
            value: student?.parentname,
            icon: Users,
        },
        {
            label: "Parent Phone",
            value: student?.parentphone,
            icon: Phone,
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                    <LoaderCircle size={24} className="animate-spin text-blue-600" />
                    <span className="font-medium">Loading student details...</span>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                        Student Not Found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {error || "The requested student record could not be found."}
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft size={17} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-100 p-4">
                            <GraduationCap size={32} className="text-blue-700" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                Student Details
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                View personal information and academic records.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                        <Pencil size={17} />
                        Edit Details
                    </button>
                </div>

                {/* Student Profile Card */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white">
                                <UserRound size={40} />
                            </div>

                            <div className="text-white">
                                <p className="text-sm font-medium text-blue-100">
                                    Student Profile
                                </p>
                                <h2 className="mt-1 text-2xl font-bold">
                                    {student.name || "Unnamed Student"}
                                </h2>
                                <p className="mt-1 text-sm text-blue-100">
                                    {student.email || "No email provided"}
                                </p>
                            </div>

                            <div className="sm:ml-auto">
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                                    {student.class
                                        ? `Class ${student.class}`
                                        : "Class not assigned"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2">
                                <BookOpen size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Student Information
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Personal and academic details
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
                        {detailItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="flex min-w-0 items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-100 hover:bg-blue-50/40"
                                >
                                    <div className="rounded-lg bg-white p-2.5 shadow-sm">
                                        <Icon size={19} className="text-blue-600" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {item.label}
                                        </p>
                                        <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                                            {item.value || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Footer */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Review the information before making any changes.
                    </p>

                    <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                        <Pencil size={16} />
                        Update Student Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;