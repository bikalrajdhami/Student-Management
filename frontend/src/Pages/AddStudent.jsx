import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    GraduationCap,
    UserRoundPlus,
    Pencil,
} from "lucide-react";
import StudentForm from "../Components/StudentForm";
import { getStudentById } from "../api/studentApi";

const AddStudent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [student, setStudent] = useState(
        location.state?.student || null
    );
    const [loading, setLoading] = useState(Boolean(id) && !location.state?.student);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id || location.state?.student) {
            setStudent(location.state?.student || null);
            setLoading(false);
            return;
        }

        const fetchStudent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getStudentById(id);
                setStudent(response.data.student);
            } catch (err) {
                setError("Unable to load student details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id, location.state]);

    const isEdit = Boolean(student);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3">
                                <GraduationCap
                                    size={28}
                                    className="text-blue-700"
                                />
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                {isEdit ? "Edit Student" : "Add New Student"}
                            </h1>
                        </div>

                        <p className="text-sm text-slate-500 sm:text-base">
                            {isEdit
                                ? "Update the student's information below."
                                : "Register a new student and manage their information."}
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                        {isEdit ? (
                            <Pencil size={16} className="text-amber-600" />
                        ) : (
                            <UserRoundPlus size={16} className="text-blue-600" />
                        )}

                        {isEdit ? "Update Record" : "New Registration"}
                    </div>
                </div>

                {/* Form Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-white px-5 py-5 sm:px-8">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Student Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Please enter the information carefully.
                        </p>
                    </div>

                    <div className="p-5 sm:p-8">
                        {loading ? (
                            <p className="py-8 text-center text-slate-500">
                                Loading student information...
                            </p>
                        ) : error ? (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        ) : (
                            <StudentForm student={student} />
                        )}
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                    Student Management System
                </p>
            </div>
        </div>
    );
};

export default AddStudent;