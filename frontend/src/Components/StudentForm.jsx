
import React, { useState } from "react";
import { createStudent } from "../api/studentApi";



const StudentForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        class: "",
        section: "",
        address: "",
        parentname: "",
        parentphone: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            setLoading(true);

            const response = await createStudent(formData);

            console.log(response.data);

            setMessage("Student added successfully!");

            // Clear form
            setFormData({
                name: "",
                email: "",
                class: "",
                section: "",
                address: "",
                parentname: "",
                parentphone: ""
            });

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to add student"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Student Information
                </h2>

                <p className="text-gray-500 mt-1">
                    Enter the student's information below.
                </p>
            </div>

            {/* Success Message */}
            {message && (
                <div className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                    {message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* Name + Email */}
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
                            placeholder="Enter student name"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            placeholder="Enter email address"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                </div>

                {/* Class + Section */}
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
                            <option value="">
                                Select Class
                            </option>

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
                            <option value="">
                                Select Section
                            </option>

                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>

                        </select>
                    </div>

                </div>

                {/* Address */}
                <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                    </label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter student's address"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                </div>

                {/* Parent Name */}
                <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Name
                    </label>

                    <input
                        type="text"
                        name="parentname"
                        value={formData.parentname}
                        onChange={handleChange}
                        placeholder="Enter student's Parent Name"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                </div>

                {/* Parent Phone Number */}
                <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Phone
                    </label>

                    <input
                        type="text"
                        name="parentphone"
                        value={formData.parentphone}
                        onChange={handleChange}
                        placeholder="Enter student's Parent Phone"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                </div>

                {/* Buttons */}
                <div className="flex gap-4">

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        {loading ? "Adding Student..." : "Add Student"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                                name: "",
                                email: "",
                                class: "",
                                section: "",
                                address: "",
                                parentname: "",
                                parentphone: ""
                            })
                        }
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
                    >
                        Clear
                    </button>

                </div>

            </form>

        </div>

    

    );
};

export default StudentForm;
