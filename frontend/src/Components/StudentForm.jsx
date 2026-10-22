
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, UserRound } from "lucide-react";
import { createStudent, updateStudent } from "../api/studentApi";

const initialFormData = {
    name: "",
    email: "",
    class: "",
    section: "",
    address: "",
    parentname: "",
    parentphone: "",
};

const StudentForm = ({ student }) => {
    const navigate = useNavigate();

    // Determine whether we are adding or editing
    const isEditing = Boolean(student?._id);

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load existing student data into the form
    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || "",
                email: student.email || "",
                class: student.class || "",
                section: student.section || "",
                address: student.address || "",
                parentname: student.parentname || "",
                parentphone: student.parentphone || "",
            });
        } else {
            setFormData({ ...initialFormData });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const studentData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                class: formData.class,
                section: formData.section.trim(),
                address: formData.address.trim(),
                parentname: formData.parentname.trim(),
               parentphone: String(formData.parentphone ?? "").trim(),
            };

            if (isEditing) {
                // Update the selected student's existing record
                await updateStudent(student._id, studentData);
                setMessage("Student updated successfully!");
            } else {
                // Create a new student record
                await createStudent(studentData);
                setMessage("Student added successfully!");
            }

            // Navigate to the actual dashboard route
            setTimeout(() => {
                navigate("/student-dashboard");
            }, 800);
        } catch (err) {
            console.error("Error saving student:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to save student. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                {message && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                        label="Student Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter student name"
                        required
                    />

                    <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                    />

                    <FormField
                        label="Class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        placeholder="e.g. Six"
                        required
                    />

                    <FormField
                        label="Section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        placeholder="e.g. A"
                    />

                    <FormField
                        label="Parent / Guardian Name"
                        name="parentname"
                        value={formData.parentname}
                        onChange={handleChange}
                        placeholder="Enter parent name"
                    />

                    <FormField
                        label="Parent Phone"
                        name="parentphone"
                        value={formData.parentphone}
                        onChange={handleChange}
                        placeholder="Enter parent phone"
                    />

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter student's address"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        <ArrowLeft size={18} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isEditing ? (
                            <Save size={18} />
                        ) : (
                            <UserRound size={18} />
                        )}

                        {loading
                            ? "Saving..."
                            : isEditing
                              ? "Update Student"
                              : "Save Student"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const FormField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}) => (
    <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
    </div>
);

export default StudentForm;
