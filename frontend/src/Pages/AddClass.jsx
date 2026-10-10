
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    School,
    BookOpen,
    Users,
    CalendarDays,
    UserRound,
    Layers,
    Save,
    RotateCcw,
} from "lucide-react";

const AddClass = () => {
    const navigate = useNavigate();

    const initialFormData = {
        className: "",
        grade: "",
        academicYear: "2026",
        classTeacher: "",
        sections: ["A"],
        capacity: "40",
        status: "Active",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setMessage("");
    };

    // Handle section selection
    const handleSectionChange = (section) => {
        setFormData((prev) => {
            const exists = prev.sections.includes(section);

            return {
                ...prev,
                sections: exists
                    ? prev.sections.filter((item) => item !== section)
                    : [...prev.sections, section].sort(),
            };
        });

        setErrors((prev) => ({
            ...prev,
            sections: "",
        }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.className.trim()) {
            newErrors.className = "Please enter the class name.";
        }

        if (
            formData.grade === "" ||
            Number(formData.grade) < 1 ||
            Number(formData.grade) > 12
        ) {
            newErrors.grade = "Select a grade between 1 and 12.";
        }

        if (!formData.academicYear.trim()) {
            newErrors.academicYear = "Please enter the academic year.";
        }

        if (formData.sections.length === 0) {
            newErrors.sections = "Select at least one section.";
        }

        if (
            formData.capacity === "" ||
            Number(formData.capacity) < 1 ||
            !Number.isInteger(Number(formData.capacity))
        ) {
            newErrors.capacity = "Capacity must be a positive whole number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Submit form (frontend only)
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) {
            return;
        }

        // Preview the data until the backend API is connected
        console.log("Class form data:", formData);

        setMessage(
            "Validation successful! Connect your backend API to save this class."
        );
    };

    // Reset form
    const handleReset = () => {
        setFormData(initialFormData);
        setErrors({});
        setMessage("");
    };

    // Reusable input style
    const inputClass = (field) =>
        `mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition
        ${
            errors[field]
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <School size={25} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Add New Class
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Create and configure a new school class.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>

                    {/* Class Information */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BookOpen size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-800">
                                    Class Information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Enter the basic details of the class.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                            {/* Class Name */}
                            <div>
                                <label
                                    htmlFor="className"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Class Name <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="className"
                                    name="className"
                                    type="text"
                                    value={formData.className}
                                    onChange={handleChange}
                                    placeholder="e.g. Class 6"
                                    className={inputClass("className")}
                                />

                                {errors.className && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.className}
                                    </p>
                                )}
                            </div>

                            {/* Grade */}
                            <div>
                                <label
                                    htmlFor="grade"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Grade <span className="text-red-500">*</span>
                                </label>

                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className={inputClass("grade")}
                                >
                                    <option value="">Select grade</option>

                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                        (grade) => (
                                            <option key={grade} value={grade}>
                                                Grade {grade}
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.grade && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.grade}
                                    </p>
                                )}
                            </div>

                            {/* Academic Year */}
                            <div>
                                <label
                                    htmlFor="academicYear"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Academic Year <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="academicYear"
                                        name="academicYear"
                                        type="text"
                                        value={formData.academicYear}
                                        onChange={handleChange}
                                        placeholder="e.g. 2026"
                                        className={`${inputClass("academicYear")} pl-10`}
                                    />
                                </div>

                                {errors.academicYear && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.academicYear}
                                    </p>
                                )}
                            </div>

                            {/* Capacity */}
                            <div>
                                <label
                                    htmlFor="capacity"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Maximum Student Capacity{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <Users
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        placeholder="e.g. 40"
                                        className={`${inputClass("capacity")} pl-10`}
                                    />
                                </div>

                                {errors.capacity && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.capacity}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Class Organization */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <Layers size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-gray-800">
                                    Class Organization
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Configure sections and class teacher.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                            {/* Class Teacher */}
                            <div>
                                <label
                                    htmlFor="classTeacher"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Class Teacher
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <select
                                        id="classTeacher"
                                        name="classTeacher"
                                        value={formData.classTeacher}
                                        onChange={handleChange}
                                        className={`${inputClass("classTeacher")} pl-10`}
                                    >
                                        <option value="">
                                            Select class teacher
                                        </option>
                                        <option value="teacher1">
                                            Teacher list will be connected to API
                                        </option>
                                    </select>
                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Connect your teacher API to load real teachers.
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Class Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputClass("status")}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Sections */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Sections <span className="text-red-500">*</span>
                                </label>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select all sections required for this class.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {["A", "B", "C", "D", "E", "F"].map(
                                        (section) => {
                                            const selected =
                                                formData.sections.includes(section);

                                            return (
                                                <button
                                                    key={section}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSectionChange(section)
                                                    }
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl border font-semibold transition ${
                                                        selected
                                                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:bg-blue-50"
                                                    }`}
                                                    aria-pressed={selected}
                                                    aria-label={`Section ${section}`}
                                                >
                                                    {section}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                {errors.sections && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.sections}
                                    </p>
                                )}

                                <p className="mt-3 text-xs text-gray-500">
                                    Selected sections:{" "}
                                    {formData.sections.length > 0
                                        ? formData.sections.join(", ")
                                        : "None"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    {message && (
                        <div
                            role="status"
                            className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
                        >
                            {message}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            <RotateCcw size={17} />
                            Reset Form
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Save size={18} />
                            Save Class
                        </button>

                    </div>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    School Management System
                </p>
            </div>
        </div>
    );
};

export default AddClass;

