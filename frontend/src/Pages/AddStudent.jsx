import React from "react";
import StudentForm from "../Components/studentForm";
import StudentsTable from "../Components/StudentsTable";



const AddStudent = () => {
    return (
        <div className="min-h-screen bg-gray-100">

            {/* Form */}
            <main className="max-w-4xl mx-auto px-6 py-8">

                <StudentForm />

            </main>
             <StudentsTable/>
        </div>
       
    );
};

export default AddStudent;