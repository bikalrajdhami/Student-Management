import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getStudentById,
    updateStudent
} from "../api/studentApi";

const EditStudent = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        class: "",
        section: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchStudent = async () => {

            try {

                const response = await getStudentById(id);

                console.log(response.data);

                setFormData(response.data.student);

            } catch (error) {

                console.log(error);

                setError("Failed to load student");

            } finally {

                setLoading(false);

            }
        };

        fetchStudent();

    }, [id]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        try {

            setUpdating(true);

            const response = await updateStudent(id, formData);

            console.log(response.data);

            setMessage("Student updated successfully!");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to update student"
            );

        } finally {

            setUpdating(false);

        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading student...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Student
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Update student information
                    </p>

                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Student Information
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Update the student's information below.
                        </p>

                    </div>

                    {message && (
                        <div className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class
                                </label>

                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Class</option>
                                    <option value="1">Class 1</option>
                                    <option value="2">Class 2</option>
                                    <option value="3">Class 3</option>
                                    <option value="4">Class 4</option>
                                    <option value="5">Class 5</option>
                                    <option value="6">Class 6</option>
                                    <option value="7">Class 7</option>
                                    <option value="8">Class 8</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                    <option value="+2">+2</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section
                                </label>

                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Section</option>
                                    <option value="A">Section A</option>
                                    <option value="B">Section B</option>
                                    <option value="C">Section C</option>
                                    <option value="D">Section D</option>
                                </select>
                            </div>

                        </div>

                        <div className="mb-6">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <div className="flex gap-4">

                            <button
                                type="submit"
                                disabled={updating}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition"
                            >
                                {updating
                                    ? "Updating..."
                                    : "Update Student"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
};

export default EditStudent;