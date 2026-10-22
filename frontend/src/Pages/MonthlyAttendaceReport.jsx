
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  CalendarOff,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

// import { getAttendance } from "../../api/attendanceApi";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const MonthlyAttendanceReport = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [search, setSearch] = useState("");

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAttendance();
      setAttendance(response.data.attendance || []);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load attendance records. Please check your backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Available classes
  const classes = useMemo(() => {
    return [
      ...new Set(
        attendance
          .map((record) => record.attendanceclass?.classname)
          .filter(Boolean)
      ),
    ].sort();
  }, [attendance]);

  // Available sections based on selected class
  const sections = useMemo(() => {
    const filtered = attendance.filter((record) => {
      const className = record.attendanceclass?.classname || "";

      return selectedClass === "All" || className === selectedClass;
    });

    return [
      ...new Set(
        filtered.map((record) => record.section).filter(Boolean)
      ),
    ].sort();
  }, [attendance, selectedClass]);

  // Filter attendance records
  const filteredAttendance = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return attendance.filter((record) => {
      if (!record.date) return false;

      const date = new Date(record.date);

      if (Number.isNaN(date.getTime())) return false;

      const studentName = record.student?.name || "";
      const className = record.attendanceclass?.classname || "";

      const matchesMonth =
        date.getMonth() === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear);

      const matchesClass =
        selectedClass === "All" || className === selectedClass;

      const matchesSection =
        selectedSection === "All" ||
        record.section === selectedSection;

      const matchesSearch =
        studentName.toLowerCase().includes(searchText) ||
        className.toLowerCase().includes(searchText);

      return (
        matchesMonth &&
        matchesClass &&
        matchesSection &&
        matchesSearch
      );
    });
  }, [
    attendance,
    selectedMonth,
    selectedYear,
    selectedClass,
    selectedSection,
    search,
  ]);

  // Group attendance records by student
  const monthlySummary = useMemo(() => {
    const students = new Map();

    filteredAttendance.forEach((record) => {
      const student = record.student;

      const studentId =
        student?._id ||
        record.studentId ||
        (typeof student === "string" ? student : null);

      if (!studentId) return;

      const className =
        record.attendanceclass?.classname || "Unknown";

      const section = record.section || "-";

      const key = `${studentId}-${className}-${section}`;

      if (!students.has(key)) {
        students.set(key, {
          studentId,
          name: student?.name || "Unknown Student",
          className,
          section,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          total: 0,
        });
      }

      const summary = students.get(key);
      const status = (record.status || "").toLowerCase();

      if (["present", "absent", "late", "leave"].includes(status)) {
        summary[status] += 1;
        summary.total += 1;
      }
    });

    return Array.from(students.values())
      .map((student) => ({
        ...student,
        percentage:
          student.total > 0
            ? ((student.present + student.late) / student.total) * 100
            : 0,
      }))
      .filter((student) =>
        student.name.toLowerCase().includes(search.trim().toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredAttendance, search]);

  // Statistics
  const stats = useMemo(() => {
    return filteredAttendance.reduce(
      (result, record) => {
        result.total += 1;

        const status = (record.status || "").toLowerCase();

        if (status === "present") result.present += 1;
        if (status === "absent") result.absent += 1;
        if (status === "late") result.late += 1;
        if (status === "leave") result.leave += 1;

        return result;
      },
      { total: 0, present: 0, absent: 0, late: 0, leave: 0 }
    );
  }, [filteredAttendance]);

  const statCards = [
    {
      label: "Total Records",
      value: stats.total,
      icon: Users,
      style: "bg-blue-50 text-blue-600",
    },
    {
      label: "Present",
      value: stats.present,
      icon: CheckCircle,
      style: "bg-green-50 text-green-600",
    },
    {
      label: "Absent",
      value: stats.absent,
      icon: XCircle,
      style: "bg-red-50 text-red-600",
    },
    {
      label: "Late",
      value: stats.late,
      icon: Clock,
      style: "bg-amber-50 text-amber-600",
    },
    {
      label: "Leave",
      value: stats.leave,
      icon: CalendarOff,
      style: "bg-purple-50 text-purple-600",
    },
  ];

  // Export student summary to CSV
  const exportCSV = () => {
    if (monthlySummary.length === 0) {
      window.alert("There are no monthly records to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Class",
      "Section",
      "Present",
      "Absent",
      "Late",
      "Leave",
      "Attendance Percentage",
    ];

    const rows = monthlySummary.map((student) => [
      student.name,
      student.className,
      student.section,
      student.present,
      student.absent,
      student.late,
      student.leave,
      `${student.percentage.toFixed(1)}%`,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `attendance-${selectedYear}-${String(
      Number(selectedMonth) + 1
    ).padStart(2, "0")}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setSelectedClass("All");
    setSelectedSection("All");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Monthly Attendance Report
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review student attendance records and monthly summaries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchAttendance}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Could not load report</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                type="button"
                onClick={fetchAttendance}
                className="mt-2 text-sm font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-800">
              Filter Report
            </h2>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {/* Month */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(Number(event.target.value))
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(Number(event.target.value))
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {Array.from(
                  { length: 7 },
                  (_, index) => today.getFullYear() - 5 + index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setSelectedSection("All");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Classes</option>
                {classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(event) =>
                  setSelectedSection(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Student
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Student name..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>

                  <div className={`rounded-xl p-3 ${card.style}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold text-gray-900">
                  {card.value}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Monthly Student Summary */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Student Monthly Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {MONTHS[Number(selectedMonth)]} {selectedYear}
                {" · "}
                {monthlySummary.length} student/class summaries
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <FileSpreadsheet size={18} />
              Monthly Report
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading attendance report...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">S.N.</th>
                    <th className="px-5 py-4 font-semibold">Student</th>
                    <th className="px-5 py-4 font-semibold">Class</th>
                    <th className="px-5 py-4 font-semibold">Section</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Present
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Absent
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Late
                    </th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Leave
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Attendance %
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {monthlySummary.length > 0 ? (
                    monthlySummary.map((student, index) => (
                      <tr
                        key={`${student.studentId}-${student.className}-${student.section}`}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {student.name}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {student.className}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {student.section}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-green-700">
                          {student.present}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-red-600">
                          {student.absent}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-amber-600">
                          {student.late}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-purple-600">
                          {student.leave}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex min-w-28 items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${
                                  student.percentage >= 90
                                    ? "bg-green-500"
                                    : student.percentage >= 75
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    student.percentage,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="min-w-12 font-semibold text-gray-700">
                              {student.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-5 py-12 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <CalendarDays
                            size={36}
                            className="mb-3 text-gray-300"
                          />

                          <p className="font-semibold text-gray-700">
                            No attendance records found
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Try another month or change your filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-xs leading-5 text-gray-500">
            Attendance percentage is calculated as (Present + Late) ÷
            (Present + Absent + Late + Leave) × 100. Confirm your school's
            policy for whether Late should count as attended.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendanceReport;
