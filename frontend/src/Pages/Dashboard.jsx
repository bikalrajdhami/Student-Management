import React from "react";
import { getTeachers } from "../api/teacherApi";

const Dashboard = () => {

    return (
        <main className="p-6">

            {/* Welcome Section */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, Admin! 👋
                </h1>

                <p className="text-gray-500 mt-1">
                    Here's what's happening in your school today.
                </p>

            </div>


            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Students */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    <p className="text-gray-500 text-sm">
                        Total Students
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        800
                    </h2>

                    <p className="text-green-600 text-sm mt-2">
                        +12 this month
                    </p>

                </div>


                {/* Teachers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    <p className="text-gray-500 text-sm">
                        Total Teachers
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        8
                    </h2>

                    <p className="text-green-600 text-sm mt-2">
                        +2 this month
                    </p>

                </div>


                {/* Classes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    <p className="text-gray-500 text-sm">
                        Total Classes
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        24
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                        Academic Year 2083
                    </p>

                </div>


                {/* Attendance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    <p className="text-gray-500 text-sm">
                        Today's Attendance
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        94%
                    </h2>

                    <p className="text-green-600 text-sm mt-2">
                        Good attendance
                    </p>

                </div>

            </div>


            {/* Welcome Card */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                <h2 className="text-xl font-semibold text-gray-800">
                    School Management Dashboard
                </h2>

                <p className="text-gray-500 mt-2">
                    Manage students, teachers, classes, attendance,
                    fees and reports from one place.
                </p>

            </div>

        </main>
    );
};

export default Dashboard;