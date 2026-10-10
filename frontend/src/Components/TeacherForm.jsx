
import React, { useState } from "react";
import { createTeacher } from "../api/teacherApi";
import { useNavigate } from "react-router-dom";

const TeacherForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        teacherID: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        qualification: "",
        specialization: "",
        department: "",
        subjects: "",
        classes: "",
        joiningDate: "",
        salary: "",
        status: "Active",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // Handle input change
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // Handle form submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            // Convert form data into backend format
            const teacherData = {

                ...formData,

                subjects: formData.subjects
                    .split(",")
                    .map((subject) => subject.trim())
                    .filter((subject) => subject !== ""),

                classes: formData.classes
                    .split(",")
                    .map((className) => className.trim())
                    .filter((className) => className !== ""),

                salary: Number(formData.salary),
            };


            console.log("Sending teacher data:", teacherData);


            // Send data to backend
            const response = await createTeacher(teacherData);


            console.log("Teacher created:", response.data);


            setSuccess("Teacher added successfully!");


            // Go to teachers list after successful save
            setTimeout(() => {
                navigate("/AddTeacher");
            }, 1000);


        } catch (error) {

            console.error("Error creating teacher:", error);

            setError(
                error.response?.data?.message ||
                "Failed to add teacher"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Header */}
            <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                    Add New Teacher
                </h2>

                <p className="text-gray-500 mt-1">
                    Enter teacher information below
                </p>

            </div>


            {/* Error */}
            {error && (
                <div className="mb-5 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Success */}
            {success && (
                <div className="mb-5 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}


            <form onSubmit={handleSubmit}>


                {/* ================= PERSONAL INFORMATION ================= */}

                <div className="mb-8">

                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Personal Information
                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">


                        {/* Teacher ID */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teacher ID
                            </label>

                            <input
                                type="text"
                                name="teacherID"
                                value={formData.teacherID}
                                onChange={handleChange}
                                placeholder="Enter teacher ID"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* First Name */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Last Name */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Phone */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9800000000"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Gender */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Date of Birth */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Address */}
                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                </div>



                {/* ================= PROFESSIONAL INFORMATION ================= */}

                <div className="mb-8">

                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Professional Information
                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">


                        {/* Qualification */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Qualification
                            </label>

                            <select
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select Qualification
                                </option>

                                <option value="Bachelor">
                                    Bachelor
                                </option>

                                <option value="Master">
                                    Master
                                </option>

                                <option value="M.Phil">
                                    M.Phil
                                </option>

                                <option value="PhD">
                                    PhD
                                </option>

                            </select>

                        </div>


                        {/* Specialization */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Department */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>

                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select Department
                                </option>

                                <option value="Computer">
                                    Computer
                                </option>

                                <option value="Science">
                                    Science
                                </option>

                                <option value="Mathematics">
                                    Mathematics
                                </option>

                                <option value="English">
                                    English
                                </option>

                                <option value="Nepali">
                                    Nepali
                                </option>

                                <option value="Social">
                                    Social
                                </option>

                                <option value="Management">
                                    Management
                                </option>

                            </select>

                        </div>


                        {/* Subjects */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subjects
                            </label>

                            <input
                                type="text"
                                name="subjects"
                                value={formData.subjects}
                                onChange={handleChange}
                                placeholder="Math, Science, Computer"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Separate multiple subjects with commas
                            </p>

                        </div>


                        {/* Classes */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Classes
                            </label>

                            <input
                                type="text"
                                name="classes"
                                value={formData.classes}
                                onChange={handleChange}
                                placeholder="5, 6, 7"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Separate multiple classes with commas
                            </p>

                        </div>


                        {/* Joining Date */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Joining Date
                            </label>

                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Salary */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="20000"
                                min="0"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Status */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                                <option value="On Leave">
                                    On Leave
                                </option>

                            </select>

                        </div>

                    </div>

                </div>



                {/* ================= BUTTONS ================= */}

                <div className="flex justify-end gap-3 pt-5 border-t">

                    <button
                        type="button"
                        onClick={() => navigate("/AddTeacher")}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        onClick={()=>navigate("/AddTeacher")}
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    >

                        {loading ? "Saving..." : "Save Teacher"}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default TeacherForm;

