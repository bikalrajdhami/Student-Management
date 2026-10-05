import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStudent } from "../api/studentApi";

const StudentsCard = ({ student }) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${student.name}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setLoading(true);

            const response = await deleteStudent(student._id);

            console.log(response.data);

            window.location.reload();

        } catch (error) {

            console.log(error);

            alert("Failed to delete student");

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

            {/* Top Section */}
            <div className="flex items-center gap-4 mb-5">

                {/* Student Avatar */}
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                    {student.name.charAt(0).toUpperCase()}
                </div>

                {/* Student Name */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {student.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        Student
                    </p>
                </div>

            </div>

            {/* Student Information */}
            <div className="space-y-3">

                {/* Email */}
                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Email
                    </span>

                    <span className="text-gray-800 font-medium text-right break-all">
                        {student.email}
                    </span>
                </div>

                {/* Class */}
                <div className="flex justify-between">
                    <span className="text-gray-500">
                        Class
                    </span>

                    <span className="text-gray-800 font-medium">
                        {student.class}
                    </span>
                </div>

                {/* Section */}
                <div className="flex justify-between">
                    <span className="text-gray-500">
                        Section
                    </span>

                    <span className="text-gray-800 font-medium">
                        {student.section}
                    </span>
                </div>

                {/* Address */}
                <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                        Address
                    </span>

                    <span className="text-gray-800 font-medium text-right">
                        {student.address}
                    </span>
                </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t">

                {/* View */}
                <button
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
                >
                    View
                </button>

                {/* Edit */}
                <button
                    onClick={() => navigate(`/edit-student/${student._id}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                    Edit
                </button>

                {/* Delete */}
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>

            </div>

        </div>
    );
};

export default StudentsCard;