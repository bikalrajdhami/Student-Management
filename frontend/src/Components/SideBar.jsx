import React from "react";

import {
    FaTachometerAlt,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaSchool,
    FaClipboardCheck,
    FaMoneyBillWave,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
     const navigate = useNavigate();
    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-64
                    h-screen
                    bg-slate-900
                    text-white
                    flex flex-col
                    overflow-y-auto
                    transition-transform duration-300

                    ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >

                {/* Logo */}
                <div className="h-20 px-6 flex items-center justify-between border-b border-slate-700 shrink-0">

                    <div>
                        <h1 className="text-xl font-bold">
                            Rising Star English School
                        </h1>

                        <p className="text-xs text-slate-400 mt-1">
                            Admin Panel
                        </p>
                    </div>

                    {/* Close Button - Mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">

                    <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">
                        Main Menu
                    </p>

                    <div className="space-y-2">

                        <a
                            href="/"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaTachometerAlt />
                               <button onClick={()=> navigate("/")}></button>
                            <span>Dashboard</span>
                        </a>

                        <a
                            href="/student-dashboard"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaUserGraduate />
                            <button onClick={()=> navigate("/student-dashboard")}>
                            <span>Students</span>
                            </button>
                        </a>

                        <a
                            href="/teacher-dashboard"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaChalkboardTeacher />
                             <button onClick={()=> navigate("/teacher-dashboard")}>
                            <span>Teachers</span>
                            </button>
                        </a>

                        <a
                            href="/class-dashboard"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaSchool />
                            <button onClick={()=> navigate("/ClassDashboard")}></button>
                            <span>Classes</span>
                        </a>

                        <a
                            href="/attendance-home"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaClipboardCheck />
                          <button onClick={()=> navigate("/AttendanceHome")}></button>
                            <span>Attendance</span>
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaMoneyBillWave />
                            <span>Fees</span>
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaChartBar />
                            <span>Reports</span>
                        </a>

                    </div>

                    {/* Settings */}
                    <div className="mt-8">

                        <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">
                            System
                        </p>

                        <a
                            href="#"
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        >
                            <FaCog />
                            <span>Settings</span>
                        </a>

                    </div>

                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-700 shrink-0">

                    <button
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
};

export default SideBar;