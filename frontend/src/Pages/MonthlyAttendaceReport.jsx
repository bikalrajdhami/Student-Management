import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  X,
  RotateCcw,
} from "lucide-react";

import { getAttendance } from "../api/attendanceApi";

// --------------------------------------------------
// Constants
// --------------------------------------------------

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TIME_ZONE = "Asia/Kathmandu";

// --------------------------------------------------
// Helper Functions
// --------------------------------------------------

const getToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}-${values.day}`;
};

const getDateKey = (value) => {
  if (!value) return "";

  // Avoid timezone shifts for YYYY-MM-DD values.
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return value;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parsedDate);

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}-${values.day}`;
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getStudentName = (record) => {
  const student = record?.student;

  if (student && typeof student === "object") {
    if (student.name) return student.name;

    const firstName = student.firstName || student.firstname || "";
    const lastName = student.lastName || student.lastname || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      student.studentName ||
      student.fullName ||
      record.studentName ||
      "Unknown Student"
    );
  }

  return record?.studentName || "Unknown Student";
};

const getStudentIdentifier = (record) => {
  const student = record?.student;

  if (student && typeof student === "object") {
    return String(
      student.studentId ||
        student.rollNumber ||
        student.admissionNumber ||
        student._id ||
        ""
    );
  }

  return String(
    record?.studentId ||
      (typeof student === "string" ? student : "") ||
      ""
  );
};

const getClassName = (record) => {
  const attendanceClass = record?.attendanceclass;

  if (attendanceClass && typeof attendanceClass === "object") {
    return (
      attendanceClass.className ||
      attendanceClass.classname ||
      attendanceClass.name ||
      attendanceClass.grade ||
      attendanceClass.title ||
      "Unknown Class"
    );
  }

  return (
    record?.className ||
    record?.classname ||
    (attendanceClass ? String(attendanceClass) : "Unknown Class")
  );
};

const getClassFilterValue = (record) => {
  const attendanceClass = record?.attendanceclass;

  if (attendanceClass && typeof attendanceClass === "object") {
    return String(
      attendanceClass._id ||
        attendanceClass.id ||
        getClassName(record)
    );
  }

  return String(
    attendanceClass ||
      record?.className ||
      record?.classname ||
      "Unknown Class"
  );
};

const getSection = (record) => {
  return String(record?.section || "").trim() || "-";
};

const getNormalizedStatus = (record) => {
  const status = String(record?.status || "")
    .trim()
    .toLowerCase();

  if (status === "present") return "present";
  if (status === "absent") return "absent";
  if (status === "late") return "late";

  if (status === "leave" || status === "on leave") {
    return "leave";
  }

  return "unknown";
};

const formatDate = (value) => {
  const dateKey = getDateKey(value);

  if (!dateKey) return "N/A";

  const [year, month, day] = dateKey.split("-");

  return `${day}/${month}/${year}`;
};

const escapeCSV = (value) => {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
};

// --------------------------------------------------
// Monthly Attendance Report
// --------------------------------------------------

const MonthlyAttendanceReport = () => {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    () => Number(getToday().split("-")[1]) - 1
  );

  const [selectedYear, setSelectedYear] = useState(
    () => Number(getToday().split("-")[0])
  );

  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // Fetch Attendance Records
  // --------------------------------------------------

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setExportMessage("");

      const response = await getAttendance();

      const records = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.attendance)
          ? response.data.attendance
          : [];

      setAttendance(records);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load attendance records. Please check your backend API."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  // --------------------------------------------------
  // Available Classes
  // --------------------------------------------------

  const classes = useMemo(() => {
    const uniqueClasses = new Map();

    attendance.forEach((record) => {
      const value = getClassFilterValue(record);
      const label = getClassName(record);

      if (value && label) {
        uniqueClasses.set(value, {
          value,
          label,
        });
      }
    });

    return Array.from(uniqueClasses.values()).sort((a, b) =>
      a.label.localeCompare(b.label, undefined, {
        numeric: true,
      })
    );
  }, [attendance]);

  // --------------------------------------------------
  // Available Sections
  // --------------------------------------------------

  const sections = useMemo(() => {
    const uniqueSections = new Set();

    attendance.forEach((record) => {
      const matchesClass =
        selectedClass === "All" ||
        getClassFilterValue(record) === selectedClass;

      if (matchesClass && record.section) {
        uniqueSections.add(String(record.section).trim());
      }
    });

    return Array.from(uniqueSections)
      .filter(Boolean)
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );
  }, [attendance, selectedClass]);

  // --------------------------------------------------
  // Filter Monthly Attendance Records
  // --------------------------------------------------

  const filteredAttendance = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return attendance.filter((record) => {
      const dateKey = getDateKey(record.date);

      if (!dateKey) return false;

      const [yearText, monthText] = dateKey.split("-");

      const recordYear = Number(yearText);
      const recordMonth = Number(monthText) - 1;

      const matchesMonth =
        recordMonth === Number(selectedMonth) &&
        recordYear === Number(selectedYear);

      const matchesClass =
        selectedClass === "All" ||
        getClassFilterValue(record) === selectedClass;

      const matchesSection =
        selectedSection === "All" ||
        getSection(record) === selectedSection;

      const studentName = getStudentName(record).toLowerCase();
      const studentIdentifier =
        getStudentIdentifier(record).toLowerCase();

      const className = getClassName(record).toLowerCase();

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentIdentifier.includes(searchText) ||
        className.includes(searchText);

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

  // --------------------------------------------------
  // Group Attendance by Student, Class, and Section
  // --------------------------------------------------

  const monthlySummary = useMemo(() => {
    const students = new Map();

    filteredAttendance.forEach((record) => {
      const student = record.student;

      const studentId =
        getId(student) ||
        getStudentIdentifier(record) ||
        getStudentName(record);

      const className = getClassName(record);
      const classId = getClassFilterValue(record);
      const section = getSection(record);

      // A student can have records in different classes or sections.
      const key = `${studentId}-${classId}-${section}`;

      if (!students.has(key)) {
        students.set(key, {
          key,
          studentId,
          name: getStudentName(record),
          identifier: getStudentIdentifier(record),
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
      const status = getNormalizedStatus(record);

      if (
        status === "present" ||
        status === "absent" ||
        status === "late" ||
        status === "leave"
      ) {
        summary[status] += 1;
        summary.total += 1;
      }
    });

    return Array.from(students.values())
      .map((student) => {
        const attended = student.present + student.late;

        return {
          ...student,
          percentage:
            student.total > 0
              ? (attended / student.total) * 100
              : 0,
        };
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [filteredAttendance]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const stats = useMemo(() => {
    return filteredAttendance.reduce(
      (result, record) => {
        result.total += 1;

        const status = getNormalizedStatus(record);

        if (status === "present") result.present += 1;
        if (status === "absent") result.absent += 1;
        if (status === "late") result.late += 1;
        if (status === "leave") result.leave += 1;

        return result;
      },
      {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
      }
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

  // --------------------------------------------------
  // Export Monthly Summary to CSV
  // --------------------------------------------------

  const exportCSV = () => {
    setExportMessage("");

    if (monthlySummary.length === 0) {
      setExportMessage(
        "There are no monthly records to export. Please change your filters."
      );
      return;
    }

    const headers = [
      "Student ID",
      "Student Name",
      "Class",
      "Section",
      "Present",
      "Absent",
      "Late",
      "Leave",
      "Total Marked Days",
      "Attendance Percentage",
    ];

    const rows = monthlySummary.map((student) => [
      student.identifier,
      student.name,
      student.className,
      student.section,
      student.present,
      student.absent,
      student.late,
      student.leave,
      student.total,
      `${student.percentage.toFixed(1)}%`,
    ]);

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

    setExportMessage("Monthly report exported successfully.");
  };

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const resetFilters = () => {
    const today = getToday();

    setSelectedMonth(Number(today.split("-")[1]) - 1);
    setSelectedYear(Number(today.split("-")[0]));
    setSelectedClass("All");
    setSelectedSection("All");
    setSearch("");
    setExportMessage("");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
              Review student attendance and monthly summaries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={exportCSV}
              disabled={loading || monthlySummary.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">
                Could not load report
              </p>

              <p className="mt-1 text-sm">{error}</p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-2 text-sm font-semibold underline"
              >
                Try again
              </button>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded p-1 hover:bg-red-100"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Export Message */}
        {exportMessage && (
          <div
            role="status"
            className="mb-6 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700"
          >
            <FileSpreadsheet size={19} className="shrink-0" />
            {exportMessage}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-800">
                Filter Report
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose a month, year, class, or section.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {/* Month */}
            <div>
              <label
                htmlFor="report-month"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Month
              </label>

              <select
                id="report-month"
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
              <label
                htmlFor="report-year"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Year
              </label>

              <select
                id="report-year"
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(Number(event.target.value))
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {Array.from(
                  {
                    length: 7,
                  },
                  (_, index) => Number(getToday().split("-")[0]) - 5 + index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label
                htmlFor="report-class"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Class
              </label>

              <select
                id="report-class"
                value={selectedClass}
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setSelectedSection("All");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Classes</option>

                {classes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label
                htmlFor="report-section"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Section
              </label>

              <select
                id="report-section"
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
              <label
                htmlFor="report-search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search Student
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="report-search"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Name or student ID..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredAttendance.length}
            </span>{" "}
            attendance records for {MONTHS[selectedMonth]} {selectedYear}.
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

        {/* Student Monthly Summary */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Student Monthly Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {MONTHS[selectedMonth]} {selectedYear}
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
          ) : monthlySummary.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <CalendarDays
                size={38}
                className="mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-800">
                No attendance records found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                There are no attendance records for the selected
                month and filters. Try another month or reset your
                filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      S.N.
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Student
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Class
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Section
                    </th>

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

                    <th className="px-5 py-4 text-center font-semibold">
                      Total Days
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Attendance %
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {monthlySummary.map((student, index) => (
                    <tr
                      key={student.key}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">
                          {student.name}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {student.identifier || "No student ID"}
                        </div>
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

                      <td className="px-5 py-4 text-center font-medium text-gray-700">
                        {student.total}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex min-w-32 items-center gap-3">
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

                          <span className="min-w-12 text-right font-semibold text-gray-700">
                            {student.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Calculation Note */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-xs leading-5 text-gray-500">
            Attendance percentage = (Present + Late) ÷ Total
            Marked Days × 100. Total Marked Days includes Present,
            Absent, Late, and Leave records. Unrecognized statuses
            are excluded from the calculation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendanceReport;