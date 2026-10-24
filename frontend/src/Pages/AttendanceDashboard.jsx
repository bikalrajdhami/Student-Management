import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  Eye,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";

import { getAttendance, deleteAttendance } from "../api/attendanceApi";

// ------------------------------------
// Helper Functions
// ------------------------------------

const getToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
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

  // Keep date-only values unchanged to avoid timezone shifts.
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
    timeZone: "Asia/Kathmandu",
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
    return value._id || value.id || "";
  }

  return String(value);
};

const getStudentName = (record) => {
  const student = record?.student;

  if (!student) {
    return "Unknown Student";
  }

  if (typeof student === "string") {
    return student;
  }

  if (student.name) {
    return student.name;
  }

  const firstName = student.firstName || student.firstname || "";
  const lastName = student.lastName || student.lastname || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    student.studentName ||
    student.fullName ||
    "Unknown Student"
  );
};

const getClassName = (record) => {
  const attendanceClass = record?.attendanceclass;

  let className = "N/A";

  if (attendanceClass && typeof attendanceClass === "object") {
    className =
      attendanceClass.className ||
      attendanceClass.name ||
      attendanceClass.classname ||
      attendanceClass.grade ||
      attendanceClass.title ||
      "N/A";
  } else if (attendanceClass) {
    className = String(attendanceClass);
  }

  const section = record?.section;

  return section
    ? `${className} - Section ${section}`
    : className;
};

const formatDate = (value) => {
  const dateKey = getDateKey(value);

  if (!dateKey) return "N/A";

  const [year, month, day] = dateKey.split("-");

  return `${day}/${month}/${year}`;
};

const getStatus = (record) => {
  return String(record?.status || "").toLowerCase().trim();
};

const getStatusLabel = (status) => {
  const normalizedStatus = String(status || "")
    .toLowerCase()
    .trim();

  if (normalizedStatus === "present") return "Present";
  if (normalizedStatus === "absent") return "Absent";
  if (normalizedStatus === "late") return "Late";

  if (
    normalizedStatus === "leave" ||
    normalizedStatus === "on leave"
  ) {
    return "Leave";
  }

  return status || "Unknown";
};

const getStatusClasses = (status) => {
  const normalizedStatus = String(status || "")
    .toLowerCase()
    .trim();

  if (normalizedStatus === "present") {
    return "bg-green-100 text-green-700";
  }

  if (normalizedStatus === "absent") {
    return "bg-red-100 text-red-700";
  }

  if (normalizedStatus === "late") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (
    normalizedStatus === "leave" ||
    normalizedStatus === "on leave"
  ) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
};

// ------------------------------------
// Attendance Dashboard Component
// ------------------------------------

function AttendanceDashboard() {
  const navigate = useNavigate();

  // Attendance data
  const [attendance, setAttendance] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [date, setDate] = useState(getToday);
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] =
    useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ------------------------------------
  // Fetch Attendance
  // ------------------------------------

  const fetchAttendance = useCallback(async () => {
    try {
      setError("");

      const response = await getAttendance();

      const records = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.attendance)
          ? response.data.attendance
          : [];

      setAttendance(records);
    } catch (err) {
      console.error("Error fetching attendance:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance records. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ------------------------------------
  // Refresh Attendance
  // ------------------------------------

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  // ------------------------------------
  // Filter Class Options
  // ------------------------------------

  const classOptions = useMemo(() => {
    const classes = attendance.map((record) => ({
      value: `${getId(record.attendanceclass)}-${record.section || ""}`,
      label: getClassName(record),
    }));

    const uniqueClasses = new Map();

    classes.forEach((item) => {
      if (item.value !== "-") {
        uniqueClasses.set(item.value, item);
      }
    });

    return Array.from(uniqueClasses.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [attendance]);

  // ------------------------------------
  // Filter Attendance Records
  // ------------------------------------

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const recordDate = getDateKey(record.date);

      const matchesDate = !date || recordDate === date;

      const recordClassValue = `${getId(
        record.attendanceclass
      )}-${record.section || ""}`;

      const matchesClass =
        classFilter === "all" ||
        recordClassValue === classFilter;

      const status = getStatus(record);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase();

      const studentName = getStudentName(record).toLowerCase();
      const studentId = String(
        record.student?.studentId ||
          record.student?.rollNumber ||
          record.studentId ||
          ""
      ).toLowerCase();

      const className = getClassName(record).toLowerCase();
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        studentName.includes(searchTerm) ||
        studentId.includes(searchTerm) ||
        className.includes(searchTerm);

      return (
        matchesDate &&
        matchesClass &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    attendance,
    date,
    classFilter,
    statusFilter,
    search,
  ]);

  // ------------------------------------
  // Attendance Statistics
  // ------------------------------------

  const statistics = useMemo(() => {
    const total = filteredAttendance.length;

    const present = filteredAttendance.filter(
      (record) => getStatus(record) === "present"
    ).length;

    const absent = filteredAttendance.filter(
      (record) => getStatus(record) === "absent"
    ).length;

    const late = filteredAttendance.filter(
      (record) => getStatus(record) === "late"
    ).length;

    const leave = filteredAttendance.filter((record) => {
      const status = getStatus(record);

      return status === "leave" || status === "on leave";
    }).length;

    return {
      total,
      present,
      absent,
      late,
      leave,
    };
  }, [filteredAttendance]);

  // ------------------------------------
  // View Attendance
  // ------------------------------------

  const handleView = (id) => {
    if (!id) return;

    navigate(`/attendance/view/${id}`);
  };

  // ------------------------------------
  // Edit Attendance
  // ------------------------------------

  const handleEdit = (id) => {
    if (!id) return;

    navigate(`/attendance/edit/${id}`);
  };

  // ------------------------------------
  // Open Delete Confirmation Modal
  // ------------------------------------

  const handleDelete = (id) => {
    if (!id) {
      setError("Attendance record ID is missing.");
      return;
    }

    setSelectedAttendanceId(id);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // ------------------------------------
  // Confirm Delete
  // ------------------------------------

  const confirmDelete = async () => {
    if (!selectedAttendanceId || deleting) return;

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteAttendance(selectedAttendanceId);

      // Remove deleted record from the table.
      setAttendance((previous) =>
        previous.filter(
          (record) =>
            getId(record) !== String(selectedAttendanceId)
        )
      );

      // Close the popup after successful deletion.
      setShowDeleteModal(false);
      setSelectedAttendanceId(null);
    } catch (err) {
      console.error("Error deleting attendance:", err);

      setDeleteError(
        err.response?.data?.message ||
          "Failed to delete attendance record. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ------------------------------------
  // Cancel Delete
  // ------------------------------------

  const cancelDelete = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setSelectedAttendanceId(null);
    setDeleteError("");
  };

  // ------------------------------------
  // Reset Filters
  // ------------------------------------

  const resetFilters = () => {
    setDate(getToday());
    setClassFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  // ------------------------------------
  // Dashboard UI
  // ------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Attendance Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and monitor student attendance records.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div className="flex-1">{error}</div>

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

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* Total */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Records
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {statistics.total}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Users size={24} />
              </div>
            </div>
          </div>

          {/* Present */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Present
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {statistics.present}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <UserCheck size={24} />
              </div>
            </div>
          </div>

          {/* Absent */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Absent
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {statistics.absent}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <UserX size={24} />
              </div>
            </div>
          </div>

          {/* Late */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Late
                </p>

                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                  {statistics.late}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <Clock size={24} />
              </div>
            </div>
          </div>

          {/* Leave */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Leave
                </p>

                <h2 className="mt-2 text-3xl font-bold text-indigo-600">
                  {statistics.leave}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <CalendarCheck size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              Attendance Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search and filter attendance records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <div>
              <label
                htmlFor="attendance-search"
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
                  id="attendance-search"
                  type="text"
                  placeholder="Name or student ID..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label
                htmlFor="attendance-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Attendance Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="attendance-date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Class Filter */}
            <div>
              <label
                htmlFor="attendance-class"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Class / Section
              </label>

              <select
                id="attendance-class"
                value={classFilter}
                onChange={(event) =>
                  setClassFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Classes</option>

                {classOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="attendance-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Attendance Status
              </label>

              <select
                id="attendance-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="leave">Leave</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredAttendance.length}
              </span>{" "}
              attendance record(s)
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw
                size={32}
                className="animate-spin text-blue-600"
              />

              <p className="mt-4 text-sm text-gray-500">
                Loading attendance records...
              </p>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <CalendarDays
                  size={30}
                  className="text-gray-400"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No Attendance Records Found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                No attendance records match the selected date and
                filters. Try changing your search criteria.
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
              <table className="w-full min-w-[1000px] text-left text-sm">

                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-gray-600">
                      S.N.
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-600">
                      Class / Section
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-600">
                      Reason
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-600">
                      Marked By
                    </th>

                    <th className="px-5 py-4 text-center font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.map((record, index) => {
                    const id = getId(record);
                    const status = getStatus(record);

                    return (
                      <tr
                        key={id || `${record.date}-${index}`}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Serial Number */}
                        <td className="px-5 py-4 font-medium text-gray-500">
                          {index + 1}
                        </td>

                        {/* Student */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {getStudentName(record)}
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            {record.student?.studentId ||
                              record.student?.rollNumber ||
                              record.studentId ||
                              "No student ID"}
                          </div>
                        </td>

                        {/* Class */}
                        <td className="px-5 py-4 text-gray-700">
                          {getClassName(record)}
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(record.date)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              status
                            )}`}
                          >
                            {getStatusLabel(record.status)}
                          </span>
                        </td>

                        {/* Reason */}
                        <td className="max-w-[180px] px-5 py-4 text-gray-600">
                          <span
                            className="block truncate"
                            title={record.reason || ""}
                          >
                            {record.reason || "—"}
                          </span>
                        </td>

                        {/* Marked By */}
                        <td className="px-5 py-4 text-gray-600">
                          {typeof record.markedBy === "object"
                            ? record.markedBy?.name ||
                              record.markedBy?.fullName ||
                              "Admin"
                            : record.markedBy || "Admin"}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">

                            {/* View */}
                            <button
                              type="button"
                              onClick={() => handleView(id)}
                              title="View Attendance"
                              aria-label="View attendance"
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            >
                              <Eye size={18} />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEdit(id)}
                              title="Edit Attendance"
                              aria-label="Edit attendance"
                              className="rounded-lg bg-yellow-50 p-2 text-yellow-700 transition hover:bg-yellow-100"
                            >
                              <Pencil size={18} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(id)}
                              title="Delete Attendance"
                              aria-label="Delete attendance"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================================== */}
        {/* CENTERED DELETE CONFIRMATION MODAL */}
        {/* ================================== */}

        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget &&
                !deleting
              ) {
                cancelDelete();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            >
              {/* Modal Header */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle
                    size={28}
                    className="text-red-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleting}
                  aria-label="Close delete confirmation"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Modal Title */}
              <h2
                id="delete-modal-title"
                className="text-xl font-bold text-gray-900"
              >
                Delete Attendance Record?
              </h2>

              {/* Modal Message */}
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Are you sure you want to delete this attendance
                record? This action cannot be undone.
              </p>

              {/* Delete Error */}
              {deleteError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {deleteError}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                {/* Cancel */}
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* Confirm Delete */}
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={17} />
                      Delete Record
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AttendanceDashboard;