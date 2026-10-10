import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SideBar from "./Components/SideBar";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import AddStudent from "./Pages/AddStudent";
import AddTeachers from "./Pages/AddTeachers";
import TeacherDetails from "./Pages/TeacherDetails";
import ClassDashboard from "./Pages/ClassDashboard";
import AddClass from "./Pages/AddClass";





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
                            <Route path="/AddStudent" element={<AddStudent />} />
                            <Route path="/AddTeacher" element={<AddTeachers/>}/>
                            <Route path="/teacher-details" element={<TeacherDetails/>}/>
                            <Route path="/class-dashboard" element={<ClassDashboard/>}/>
                            <Route path="/add-class" element={<AddClass/>}/>
  
                        </Routes>
                        
                    </main>

                </div>

            </div>
        </BrowserRouter>
    );
};

export default App;