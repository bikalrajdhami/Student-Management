
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../api/studentApi";
import StudentsCard from "../Components/StudentsCard";

const Home = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    // Get students from backend
    useEffect(() => {
        getStudents()
            .then((response) => {
                console.log(response.data);

                setStudents(response.data.students);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);

                setError("Failed to load students");
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Student Management
                        </h1>

                        <p className="text-sm text-gray-500">
                            Manage students easily and efficiently
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/add-student")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                    >
                        + Add Student
                    </button>

                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome Section */}
                <section className="bg-blue-600 rounded-2xl p-8 text-white mb-8">

                    <div className="max-w-2xl">

                        <p className="text-blue-100 mb-2">
                            Welcome back 👋
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Student Management System
                        </h2>

                        <p className="text-blue-100 text-lg">
                            Manage student records, classes, sections and
                            information from one simple dashboard.
                        </p>

                    </div>

                </section>

                {/* Statistics */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Total Students */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Total Students
                                </p>

                                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                                    {students.length}
                                </h3>
                            </div>

                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                👨‍🎓
                            </div>

                        </div>

                    </div>

                    {/* Classes */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Total Classes
                                </p>

                                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                                    {students.length}
                                </h3>
                            </div>

                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
                                🏫
                            </div>

                        </div>

                    </div>

                    {/* Sections */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Sections
                                </p>

                                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                                    18
                                </h3>
                            </div>

                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl">
                                📚
                            </div>

                        </div>

                    </div>

                    {/* New Students */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-500 text-sm">
                                    New Students
                                </p>

                                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                                    {students.length}
                                </h3>
                            </div>

                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl">
                                ✨
                            </div>

                        </div>

                    </div>

                </section>

                {/* Students Section */}
                <section className="mb-8">

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Students
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                Students registered in the system
                            </p>
                        </div>

                        <button className="text-blue-600 font-medium hover:underline">
                            View All
                        </button>

                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                            <p className="text-gray-500">
                                Loading students...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <p className="text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* No Students */}
                    {!loading && !error && students.length === 0 && (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                            <div className="text-4xl mb-3">
                                👨‍🎓
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800">
                                No students found
                            </h3>

                            <p className="text-gray-500 mt-1">
                                Add your first student to get started.
                            </p>
                        </div>
                    )}

                    {/* Student Cards */}
                    {!loading && !error && students.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {students.map((student) => (
                                <StudentsCard
                                    key={student._id}
                                    student={student}
                                />
                            ))}

                        </div>
                    )}

                </section>

                {/* Quick Actions + Recent Activity */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <button   onClick={() => navigate("/add-student")} className="border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition">
                                
                                <div className="text-2xl mb-2">
                                    ➕
                                </div>

                                <h3 className="font-semibold text-gray-800">
                                   
                                    Add Student
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Register a new student
                                </p>

                            </button>

                            <button className="border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition">

                                <div className="text-2xl mb-2">
                                    👥
                                </div>

                                <h3 className="font-semibold text-gray-800">
                                    View Students
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    View all student records
                                </p>

                            </button>

                            <button className="border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition">

                                <div className="text-2xl mb-2">
                                    🔍
                                </div>

                                <h3 className="font-semibold text-gray-800">
                                    Search Student
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Find a student quickly
                                </p>

                            </button>

                            <button className="border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:bg-blue-50 transition">

                                <div className="text-2xl mb-2">
                                    📊
                                </div>

                                <h3 className="font-semibold text-gray-800">
                                    Reports
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    View student reports
                                </p>

                            </button>

                        </div>

                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-xl font-bold text-gray-800">
                                Recent Activity
                            </h2>

                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                View All
                            </button>

                        </div>

                        <div className="space-y-5">

                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    👨‍🎓
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                        Student records
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {students.length} students currently registered
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    📚
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                        Classes
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Student class information is available
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    🏫
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                        Student Management
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        System is ready to manage student records
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Home;

