
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

import { createclass, updateclass } from "../api/classApi";

const AddClass = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const existingClass = location.state?.classData;
    const isEditing = Boolean(existingClass?._id);

    const initialFormData = {
        className: "",
        grade: "",
        academicYear: "2083",
        classTeacher: "",
        sections: ["A"],
        capacity: "40",
        status: "Active",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Convert existing API class data into form values
    const mapClassToForm = (classData) => ({
        className: classData.classname || "",
        grade: String(classData.grade || ""),
        academicYear: String(classData.acdemicyear ?? "2083"),
        classTeacher:
            typeof classData.classteacher === "object"
                ? classData.classteacher?.name ||
                  classData.classteacher?.firstName ||
                  ""
                : classData.classteacher || "",
        sections: Array.isArray(classData.section)
            ? classData.section
                .map((section) =>
                    typeof section === "object"
                        ? section?.name || section?.sectionName || ""
                        : String(section)
                )
                .map((section) => section.trim())
                .filter(Boolean)
            : typeof classData.section === "string"
                ? classData.section
                    .split(",")
                    .map((section) => section.trim())
                    .filter(Boolean)
                : ["A"],
        capacity: String(classData.studentcapacity ?? "40"),
        status: classData.classstatus || "Active",
    });

    // Load existing data when editing
    useEffect(() => {
        if (existingClass?._id) {
            setFormData(mapClassToForm(existingClass));
        } else {
            setFormData({ ...initialFormData });
        }

        setErrors({});
        setMessage("");
        setMessageType("");
    }, [existingClass?._id]);

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
        setMessageType("");
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

        setMessage("");
        setMessageType("");
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.className.trim()) {
            newErrors.className = "Please enter the class name.";
        }

        const validGrades = [
            "Nursery",
            "LKG",
            "UKG",
            ...Array.from({ length: 12 }, (_, index) =>
                String(index + 1)
            ),
        ];

        if (!validGrades.includes(String(formData.grade))) {
            newErrors.grade = "Please select a valid grade.";
        }

        if (
            !formData.academicYear.trim() ||
            !Number.isInteger(Number(formData.academicYear)) ||
            Number(formData.academicYear) < 1
        ) {
            newErrors.academicYear = "Enter a valid academic year.";
        }

        if (formData.sections.length === 0) {
            newErrors.sections = "Select at least one section.";
        }

        if (
            formData.capacity === "" ||
            Number(formData.capacity) < 1 ||
            !Number.isInteger(Number(formData.capacity))
        ) {
            newErrors.capacity =
                "Capacity must be a positive whole number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Add a new class or update the existing class
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (!validateForm()) {
            return;
        }

        // Field names match your backend
        const classData = {
            classname: formData.className.trim(),
            grade: String(formData.grade),
            acdemicyear: Number(formData.academicYear),
            studentcapacity: Number(formData.capacity),
            classteacher: formData.classTeacher.trim(),
            section: formData.sections.join(", "),
            classstatus: formData.status,
        };

        try {
            setIsSaving(true);

            const response = isEditing
                ? await updateclass(existingClass._id, classData)
                : await createclass(classData);

            console.log(
                isEditing ? "Class updated:" : "Class created:",
                response.data
            );

            setMessage(
                response.data.message ||
                    (isEditing
                        ? "Class updated successfully!"
                        : "Class added successfully!")
            );

            setMessageType("success");
            setErrors({});

            // Reset only when a new class has been created.
            // Keep the updated values visible when editing.
            if (!isEditing) {
                setFormData({ ...initialFormData });
            }
        } catch (error) {
            console.error(
                isEditing ? "Error updating class:" : "Error creating class:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                    (isEditing
                        ? "Failed to update class. Check your backend update route."
                        : "Failed to save class. Please check your backend.")
            );

            setMessageType("error");
        } finally {
            setIsSaving(false);
        }
    };

    // Reset form
    const handleReset = () => {
        if (isSaving) return;

        setFormData(
            isEditing
                ? mapClassToForm(existingClass)
                : { ...initialFormData }
        );

        setErrors({});
        setMessage("");
        setMessageType("");
    };

    // Reusable input style
    const inputClass = (field) =>
        `mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
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
                                {isEditing ? "Edit Class" : "Add New Class"}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                {isEditing
                                    ? "Update the existing class information."
                                    : "Create and configure a new school class."}
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
                                    Class Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="className"
                                    name="className"
                                    type="text"
                                    value={formData.className}
                                    onChange={handleChange}
                                    placeholder="e.g. Class 6 or Nursery"
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
                                    Grade{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className={inputClass("grade")}
                                >
                                    <option value="">Select grade</option>
                                    <option value="Nursery">Nursery</option>
                                    <option value="LKG">LKG</option>
                                    <option value="UKG">UKG</option>

                                    {Array.from(
                                        { length: 12 },
                                        (_, index) => index + 1
                                    ).map((grade) => (
                                        <option
                                            key={grade}
                                            value={String(grade)}
                                        >
                                            Grade {grade}
                                        </option>
                                    ))}
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
                                    Academic Year{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="academicYear"
                                        name="academicYear"
                                        type="number"
                                        value={formData.academicYear}
                                        onChange={handleChange}
                                        placeholder="e.g. 2083"
                                        className={`${inputClass(
                                            "academicYear"
                                        )} pl-10`}
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
                                        className={`${inputClass(
                                            "capacity"
                                        )} pl-10`}
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

                                    <input
                                        id="classTeacher"
                                        name="classTeacher"
                                        type="text"
                                        value={formData.classTeacher}
                                        onChange={handleChange}
                                        placeholder="Enter teacher name"
                                        className={`${inputClass(
                                            "classTeacher"
                                        )} pl-10`}
                                    />
                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Enter the class teacher's name.
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
                                    Sections{" "}
                                    <span className="text-red-500">*</span>
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
                            className={`mb-6 rounded-xl border p-4 text-sm ${
                                messageType === "error"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-green-200 bg-green-50 text-green-700"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                        >
                            <RotateCcw size={17} />
                            Reset Form
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={18} />
                            {isSaving
                                ? isEditing
                                    ? "Updating..."
                                    : "Saving..."
                                : isEditing
                                    ? "Update Class"
                                    : "Save Class"}
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
