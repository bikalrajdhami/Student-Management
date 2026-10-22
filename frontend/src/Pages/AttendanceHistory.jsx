import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  History,
  Download,
  RefreshCw,
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  CalendarOff,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
// import { getAttendance } from "../../api/attendanceApi";

const AttendanceHistory = () => {
    const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch attendance records from the backend.
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAttendance();
      setAttendance(response.data.attendance || []);
    } catch (err) {
      console.error("Failed to fetch attendance history:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load attendance history. Please check your backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Convert a date into YYYY-MM-DD using local date values.
  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Extract available classes from fetched records.
  const classes = useMemo(() => {
    return [
      ...new Set(
        attendance
          .map((record) => record.attendanceclass?.classname)
          .filter(Boolean)
      ),
    ].sort();
  }, [attendance]);

  // Extract sections belonging to the selected class.
  const sections = useMemo(() => {
    const records = attendance.filter((record) => {
      const className = record.attendanceclass?.classname || "";

      return selectedClass === "All" || className === selectedClass;
    });

    return [
      ...new Set(
        records.map((record) => record.section).filter(Boolean)
      ),
    ].sort();
  }, [attendance, selectedClass]);

  // Apply search and filters.
  const filteredAttendance = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return attendance
      .filter((record) => {
        const studentName = record.student?.name || "";
        const className = record.attendanceclass?.classname || "";
        const section = record.section || "";
        const status = record.status || "";

        const matchesSearch =
          studentName.toLowerCase().includes(searchText) ||
          className.toLowerCase().includes(searchText) ||
          section.toLowerCase().includes(searchText);

        const matchesDate =
          !selectedDate || formatDate(record.date) === selectedDate;

        const matchesClass =
          selectedClass === "All" || className === selectedClass;

        const matchesSection =
          selectedSection === "All" || section === selectedSection;

        const matchesStatus =
          selectedStatus === "All" || status === selectedStatus;

        return (
          matchesSearch &&
          matchesDate &&
          matchesClass &&
          matchesSection &&
          matchesStatus
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [
    attendance,
    search,
    selectedDate,
    selectedClass,
    selectedSection,
    selectedStatus,
  ]);

  // Calculate summary cards from the filtered records.
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

  // Reset all filters.
  const resetFilters = () => {
    setSearch("");
    setSelectedDate("");
    setSelectedClass("All");
    setSelectedSection("All");
    setSelectedStatus("All");
  };

  // Export currently filtered records to CSV.
  const exportCSV = () => {
    if (filteredAttendance.length === 0) {
      window.alert("There are no attendance records to export.");
      return;
    }

    const headers = [
      "Date",
      "Student Name",
      "Class",
      "Section",
      "Status",
      "Reason",
    ];

    const rows = filteredAttendance.map((record) => [
      record.date ? formatDate(record.date) : "",
      record.student?.name || "Unknown Student",
      record.attendanceclass?.classname || "Unknown Class",
      record.section || "",
      record.status || "",
      record.reason || "",
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
    link.download = "attendance-history.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => {
    const styles = {
      Present: "bg-green-100 text-green-700",
      Absent: "bg-red-100 text-red-700",
      Late: "bg-amber-100 text-amber-700",
      Leave: "bg-purple-100 text-purple-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
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
              Attendance History
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Search and review previous student attendance records.
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Unable to load history</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
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

                <h2 className="mt-4 text-3xl font-bold text-gray-900">
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Search & Filter Records
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Narrow the history by date, class, section, or status.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
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
                  placeholder="Student or class..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Attendance Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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
                onChange={(event) => setSelectedSection(event.target.value)}
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

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Attendance Records
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredAttendance.length} matching records
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={18} />
              Historical Records
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading attendance history...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      S.N.
                    </th>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      Student Name
                    </th>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      Class
                    </th>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      Section
                    </th>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record, index) => (
                      <tr
                        key={record._id || index}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 text-gray-500">
                          {index + 1}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                          {record.student?.name || "Unknown Student"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          {record.attendanceclass?.classname || "—"}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {record.section || "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          {record.date
                            ? new Date(record.date).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              record.status
                            )}`}
                          >
                            {record.status || "Unknown"}
                          </span>
                        </td>

                        <td className="max-w-xs px-5 py-4 text-gray-500">
                          {record.reason || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <History
                            size={36}
                            className="mb-3 text-gray-300"
                          />

                          <p className="font-semibold text-gray-700">
                            No attendance records found
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Change your filters or check whether attendance
                            records have been saved.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-xs text-gray-500">
            This page displays saved attendance records. It does not create
            or modify attendance.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;