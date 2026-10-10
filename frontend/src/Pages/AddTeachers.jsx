import React from 'react'
import TeacherForm from '../Components/TeacherForm'
import TeacherTable from '../Components/TeacherTable'

const AddTeachers = () => {
  return (
    <div className="min-h-screen bg-gray-100">

            {/* Form */}
            <main className="max-w-4xl mx-auto px-6 py-8">

                <TeacherForm />

            </main>
             <TeacherTable/>
        </div>
  )
}

export default AddTeachers
