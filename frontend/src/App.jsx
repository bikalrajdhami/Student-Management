import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SideBar from "./Components/SideBar";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import TeacherDetails from "./Pages/TeacherDetails";
import ClassDashboard from "./Pages/ClassDashboard";
import AddClass from "./Pages/AddClass";
import TeacherDashboard from "./Pages/TeacherDashboard";
import AddTeachers from "./Pages/AddTeachers";
import ClassDetails from "./Pages/ClassDetails";
import StudentDashboard from "./Pages/StudentDashboard";
import AddStudent from "./Pages/AddStudent";
import StudentsDetails from "./Pages/StudentsDetails";
import AttendanceHome from "./Pages/AttendanceHome";
import AttendanceDashboard from "./Pages/AttendanceDashboard";
import MonthlyAttendanceReport from "./Pages/MonthlyAttendaceReport";
import AttendanceHistory from "./Pages/AttendanceHistory";





const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">

                {/* Sidebar */}
                <SideBar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Main Content */}
                <div className="lg:ml-64 min-h-screen">

                    {/* Navbar */}
                    <Navbar
                        setSidebarOpen={setSidebarOpen}
                    />

                    {/* Pages */}
                    <main className="p-6">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/student-dashboard" element={<StudentDashboard />} />
                            <Route path="/add-student" element={<AddStudent/>}/>
                            <Route path="/student-details" element={<StudentsDetails/>}/>
                            <Route path="/teacher-dashboard" element={<TeacherDashboard/>}/>
                            <Route path="/addteacher" element={<AddTeachers/>}/>
                            <Route path="/teacher-details" element={<TeacherDetails/>}/>
                            <Route path="/class-dashboard" element={<ClassDashboard/>}/>
                            <Route path="/add-class" element={<AddClass/>}/>
                            <Route path="/class-details" element={<ClassDetails/>}/>
                            <Route path="/attendance-home" element={<AttendanceHome/>}/>
                            <Route path="/attendance/dashboard" element={<AttendanceDashboard/>}/>
                            <Route path="/attendance/monthly-report" element={<MonthlyAttendanceReport/>}/>
                            <Route path="/attendance/history" element={<AttendanceHistory/>}/>
                            

  
                        </Routes>
                        
                    </main>

                </div>

            </div>
        </BrowserRouter>
    );
};

export default App;