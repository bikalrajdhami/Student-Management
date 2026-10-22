
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import TeacherForm from "../Components/TeacherForm";

const AddTeachers = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Page Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-5">
                    <button
                        type="button"
                        onClick={() => navigate("/TeacherDasboard")}
                        className="rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
                        title="Back to Teachers" 
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Users size={25} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Add New Teacher
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Enter the teacher's information below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Teacher Form */}
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <TeacherForm />
            </main>
        </div>
    );
};

export default AddTeachers;
