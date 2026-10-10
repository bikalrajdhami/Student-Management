import React from "react";

import {
    FaBars,
    FaBell,
    FaUserCircle,
} from "react-icons/fa";

const Navbar = ({ setSidebarOpen }) => {

    return (
        <header className="h-16 bg-white border-b border-gray-200">

            <div className="h-full px-6 flex items-center justify-between">

                {/* Left Side */}
                <div className="flex items-center gap-4">

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-600 hover:text-blue-600 text-xl"
                    >
                        <FaBars />
                    </button>


                    <div>

                        <h2 className="text-lg font-semibold text-gray-800">
                            Dashboard
                        </h2>

                        <p className="text-xs text-gray-500">
                            School Management System
                        </p>

                    </div>

                </div>


                {/* Right Side */}
                <div className="flex items-center gap-5">

                    {/* Notification */}
                    <button
                        className="relative text-gray-600 hover:text-blue-600 transition"
                    >

                        <FaBell className="text-xl" />

                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            3
                        </span>

                    </button>


                    {/* User */}
                    <div className="flex items-center gap-2">

                        <FaUserCircle className="text-3xl text-gray-400" />

                        <div className="hidden sm:block">

                            <p className="text-sm font-semibold text-gray-700">
                                Admin
                            </p>

                            <p className="text-xs text-gray-500">
                                Administrator
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
};

export default Navbar;