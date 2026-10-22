
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import { getAttendance } from "../api/attendanceApi";

const getToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const getDateKey = (value) => {
  if (!value) return "";

  // Handles date-only strings without timezone conversion.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const getId = (value) => {
  if (value && typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value || "");
};

const getStudentName = (student) => {
  if (!student || typeof student !== "object") {
    return "Student details unavailable";
  }

  return (
    student.name ||
    student.studentName ||
    [student.firstName, student.lastName].filter(Boolean).join(" ") ||
    "Unknown Student"
  );
};

const getClassName = (attendanceClass) => {
  if (!attendanceClass || typeof attendanceClass !== "object") {
    return "";
  }

  return (
    attendanceClass.classname ||
    attendanceClass.className ||
    attendanceClass.name ||
    ""
  );
};

const AttendanceDashboard = () => {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [date, setDate] = useState(getToday);
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Fetch attendance records from the backend.
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAttendance();

      // Supports either { attendance: [...] } or a direct array.
      const records = Array.isArray(response.data)
        ? response.data
        : response.data?.attendance;

      if (!Array.isArray(records)) {
        throw new Error(
          "Invalid API response. Expected an attendance array."
        );
      }

      setAttendance(records);
    } catch (err) {
      console.error("Error fetching attendance:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load attendance records."
      );

      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Build the available class/section filter options.
  const classes = useMemo(() => {
    const uniqueClasses = attendance
      .map((record) => {
        const className = getClassName(record.attendanceclass);
        const section = record.section || "";

        if (!className) return null;

        return {
          value: `${getId(record.attendanceclass)}::${section}`,
          label: `${className} - ${section || "N/A"}`,
        };
      })
      .filter(Boolean);

    return [
      ...new Map(
        uniqueClasses.map((item) => [item.value, item])
      ).values(),
    ];
  }, [attendance]);

  // Apply all dashboard filters.
  const filteredAttendance = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return attendance.filter((record) => {
      const matchesDate = getDateKey(record.date) === date;

      const classValue =
        `${getId(record.attendanceclass)}::${record.section || ""}`;

      const matchesClass =
        classFilter === "All" || classValue === classFilter;

      const matchesStatus =
        statusFilter === "All" ||
        String(record.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const student = record.student;
      const studentName = getStudentName(student).toLowerCase();
      const studentId =
        typeof student === "object"
          ? String(student?.studentId || student?.rollNumber || "")
              .toLowerCase()
          : "";

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentId.includes(searchText);

      return (
        matchesDate &&
        matchesClass &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [attendance, date, classFilter, statusFilter, search]);

  // Calculate cards from the currently filtered records.
  const stats = useMemo(() => {
    const present = filteredAttendance.filter(
      (record) => record.status?.toLowerCase() === "present"
    ).length;

    const absent = filteredAttendance.filter(
      (record) => record.status?.toLowerCase() === "absent"
    ).length;

    const late = filteredAttendance.filter(
      (record) => record.status?.toLowerCase() === "late"
    ).length;

    const leave = filteredAttendance.filter(
      (record) => record.status?.toLowerCase() === "leave"
    ).length;

    return {
      total: filteredAttendance.length,
      present,
      absent,
      late,
      leave,
    };
  }, [filteredAttendance]);

  const formatStudent = (record) => getStudentName(record.student);

  const formatClass = (record) => {
    const className = getClassName(record.attendanceclass);

    return `${className || "Unknown Class"} - ${
      record.section || "N/A"
    }`;
  };

  const formatTeacher = (record) => {
    const teacher = record.markedBy;

    if (teacher && typeof teacher === "object") {
      return (
        teacher.name ||
        [teacher.firstName, teacher.lastName]
          .filter(Boolean)
          .join(" ") ||
        "Teacher"
      );
    }

    return "Not recorded";
  };

  const statusStyle = {
    present: "bg-green-100 text-green-700",
    absent: "bg-red-100 text-red-700",
    late: "bg-amber-100 text-amber-700",
    leave: "bg-purple-100 text-purple-700",
  };

  const summaryCards = [
    {
      title: "Total Records",
      value: stats.total,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Present",
      value: stats.present,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Absent",
      value: stats.absent,
      icon: UserX,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Late / Leave",
      value: stats.late + stats.leave,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const clearFilters = () => {
    setDate(getToday());
    setClassFilter("All");
    setStatusFilter("All");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Attendance
            </button>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Attendance Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor daily attendance across the school.
            </p>
          </div>

          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={fetchAttendance}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900">
                      {loading ? "—" : card.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Attendance
            </h2>

            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Attendance Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Class and section */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Class / Section
              </label>

              <select
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Classes</option>

                {classes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            {/* Student search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Student
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Student name or ID..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance records */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Attendance Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Attendance status, reasons, class, section, and recording teacher.
            </p>

            {!loading && (
              <p className="mt-2 text-xs text-gray-500">
                Showing {filteredAttendance.length} record(s)
              </p>
            )}
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading attendance records...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-red-600">
              Attendance could not be loaded. Use Refresh to try again.
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="p-10 text-center">
              <Users
                size={36}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-700">
                No attendance records found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try another date or change your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Class / Section</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Marked By</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {formatStudent(record)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatClass(record)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {getDateKey(record.date) || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyle[
                              String(record.status || "").toLowerCase()
                            ] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {record.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.reason || "—"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatTeacher(record)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
