
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  CalendarOff,
  AlertCircle,
  FileSpreadsheet,
  LoaderCircle,
} from "lucide-react";

import {
  getAttendance,
  patchAttendance,
  deleteAttendance,
} from "../api/attendanceApi";

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Leave"];

const normalizeStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();

  if (value === "present") return "Present";
  if (value === "absent") return "Absent";
  if (value === "late") return "Late";
  if (value === "leave" || value === "on leave") return "Leave";

  return status || "Unknown";
};

const getStudentName = (student) => {
  if (!student) return "Unknown Student";
  if (typeof student === "string") return student;

  return (
    student.name ||
    student.fullName ||
    student.studentName ||
    student.firstName ||
    "Unknown Student"
  );
};

const getClassName = (attendanceclass) => {
  if (!attendanceclass) return "Unknown Class";
  if (typeof attendanceclass === "string") return attendanceclass;

  return (
    attendanceclass.classname ||
    attendanceclass.className ||
    attendanceclass.name ||
    attendanceclass.title ||
    "Unknown Class"
  );
};

const getId = (record) => record?._id || record?.id || "";

const toDateInput = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return String(date).slice(0, 10);
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return String(date);

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = (status) => {
  switch (normalizeStatus(status)) {
    case "Present":
      return "bg-green-100 text-green-700";
    case "Absent":
      return "bg-red-100 text-red-700";
    case "Late":
      return "bg-amber-100 text-amber-700";
    case "Leave":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const initialEditForm = (record) => ({
  section: record?.section || "",
  date: toDateInput(record?.date),
  status: normalizeStatus(record?.status),
  reason: record?.reason || "",
});

function AttendanceHistory() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const [editForm, setEditForm] = useState({
    section: "",
    date: "",
    status: "Present",
    reason: "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAttendance = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setActionError("");

    try {
      const response = await getAttendance();
      const payload = response?.data;

      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.attendance)
        ? payload.attendance
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      setAttendance(records);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load attendance records."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const classes = useMemo(() => {
    return [
      ...new Set(
        attendance
          .map((record) => getClassName(record.attendanceclass))
          .filter((value) => value !== "Unknown Class")
      ),
    ].sort();
  }, [attendance]);

  const sections = useMemo(() => {
    return [
      ...new Set(
        attendance
          .map((record) => record.section)
          .filter(Boolean)
          .map(String)
      ),
    ].sort();
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance
      .filter((record) => {
        const student = getStudentName(record.student).toLowerCase();
        const className = getClassName(record.attendanceclass).toLowerCase();
        const section = String(record.section || "").toLowerCase();
        const reason = String(record.reason || "").toLowerCase();

        const matchesSearch =
          !query ||
          student.includes(query) ||
          className.includes(query) ||
          section.includes(query) ||
          reason.includes(query);

        const matchesDate =
          !selectedDate || toDateInput(record.date) === selectedDate;

        const matchesClass =
          !selectedClass ||
          className === selectedClass.toLowerCase();

        const matchesSection =
          !selectedSection ||
          section === selectedSection.toLowerCase();

        const matchesStatus =
          !selectedStatus ||
          normalizeStatus(record.status) === selectedStatus;

        return (
          matchesSearch &&
          matchesDate &&
          matchesClass &&
          matchesSection &&
          matchesStatus
        );
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [
    attendance,
    search,
    selectedDate,
    selectedClass,
    selectedSection,
    selectedStatus,
  ]);

  const stats = useMemo(() => {
    return {
      total: filteredAttendance.length,
      present: filteredAttendance.filter(
        (record) => normalizeStatus(record.status) === "Present"
      ).length,
      absent: filteredAttendance.filter(
        (record) => normalizeStatus(record.status) === "Absent"
      ).length,
      late: filteredAttendance.filter(
        (record) => normalizeStatus(record.status) === "Late"
      ).length,
      leave: filteredAttendance.filter(
        (record) => normalizeStatus(record.status) === "Leave"
      ).length,
    };
  }, [filteredAttendance]);

  const resetFilters = () => {
    setSearch("");
    setSelectedDate("");
    setSelectedClass("");
    setSelectedSection("");
    setSelectedStatus("");
  };

  const openEditModal = (record) => {
    setActionError("");
    setSuccessMessage("");
    setEditRecord(record);
    setEditForm(initialEditForm(record));
  };

  const closeModals = () => {
    if (saving || deleting) return;

    setViewRecord(null);
    setEditRecord(null);
    setDeleteRecord(null);
    setActionError("");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editRecord) return;

    if (!editForm.date || !editForm.section.trim() || !editForm.status) {
      setActionError("Please fill in the date, section, and status.");
      return;
    }

    setSaving(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const id = getId(editRecord);

      if (!id) {
        throw new Error("This attendance record has no valid ID.");
      }

      const payload = {
        section: editForm.section.trim(),
        date: editForm.date,
        status: editForm.status.toLowerCase(),
        reason: editForm.reason.trim(),
      };

      await patchAttendance(id, payload);

      setAttendance((previous) =>
        previous.map((record) =>
          getId(record) === id
            ? {
                ...record,
                ...payload,
                date: editForm.date,
              }
            : record
        )
      );

      setEditRecord(null);
      setSuccessMessage("Attendance record updated successfully.");
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;

    const id = getId(deleteRecord);

    if (!id) {
      setActionError("This attendance record has no valid ID.");
      return;
    }

    setDeleting(true);
    setActionError("");
    setSuccessMessage("");

    try {
      await deleteAttendance(id);

      setAttendance((previous) =>
        previous.filter((record) => getId(record) !== id)
      );

      setDeleteRecord(null);
      setViewRecord((previous) =>
        previous && getId(previous) === id ? null : previous
      );
      setEditRecord((previous) =>
        previous && getId(previous) === id ? null : previous
      );

      setSuccessMessage("Attendance record deleted successfully.");
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete attendance."
      );
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    if (!filteredAttendance.length) {
      setError("There are no attendance records to export.");
      return;
    }

    const headers = [
      "Date",
      "Student",
      "Class",
      "Section",
      "Status",
      "Reason",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredAttendance.map((record) => [
      toDateInput(record.date),
      getStudentName(record.student),
      getClassName(record.attendanceclass),
      record.section || "",
      normalizeStatus(record.status),
      record.reason || "",
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
    link.download = "attendance-history.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{count}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );

  const RecordDetails = ({ record }) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Detail label="Student" value={getStudentName(record.student)} />
      <Detail label="Class" value={getClassName(record.attendanceclass)} />
      <Detail label="Section" value={record.section || "—"} />
      <Detail label="Date" value={formatDate(record.date)} />
      <div className="sm:col-span-2">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Status
        </p>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles(
            record.status
          )}`}
        >
          {normalizeStatus(record.status)}
        </span>
      </div>
      <div className="sm:col-span-2">
        <Detail label="Reason" value={record.reason || "No reason provided"} />
      </div>
      <div className="sm:col-span-2">
        <Detail
          label="Attendance ID"
          value={getId(record) || "Not available"}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-100"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Attendance History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View, update, and manage student attendance records.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fetchAttendance(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <FileSpreadsheet size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle size={18} />
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-auto"
              aria-label="Dismiss success message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Records"
            count={stats.total}
            icon={Users}
            color="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="Present"
            count={stats.present}
            icon={CheckCircle}
            color="bg-green-50 text-green-600"
          />
          <StatCard
            title="Absent"
            count={stats.absent}
            icon={XCircle}
            color="bg-red-50 text-red-600"
          />
          <StatCard
            title="Late"
            count={stats.late}
            icon={Clock}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Leave"
            count={stats.leave}
            icon={CalendarOff}
            color="bg-blue-50 text-blue-600"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Search size={18} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-800">Search and Filter</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, class..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(event) => setSelectedSection(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Attendance table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-gray-800">
              Attendance Records
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredAttendance.length} record
              {filteredAttendance.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-gray-500">
              <LoaderCircle size={32} className="animate-spin text-indigo-600" />
              <p className="text-sm">Loading attendance records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">S.N.</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Section</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.map((record, index) => (
                    <tr
                      key={getId(record) || `${record.date}-${index}`}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {getStudentName(record.student)}
                        </p>
                        {record.student?.studentId && (
                          <p className="mt-1 text-xs text-gray-400">
                            ID: {record.student.studentId}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {getClassName(record.attendanceclass)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.section || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(record.date)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(
                            record.status
                          )}`}
                        >
                          {normalizeStatus(record.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewRecord(record)}
                            title="View attendance"
                            aria-label="View attendance"
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => openEditModal(record)}
                            title="Edit attendance"
                            aria-label="Edit attendance"
                            className="rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => {
                              setActionError("");
                              setDeleteRecord(record);
                            }}
                            title="Delete attendance"
                            aria-label="Delete attendance"
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAttendance.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-5 py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-3 rounded-full bg-gray-100 p-4">
                            <Search size={26} className="text-gray-400" />
                          </div>
                          <p className="font-semibold text-gray-700">
                            No attendance records found
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or filter options.
                          </p>
                          <button
                            onClick={resetFilters}
                            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewRecord && (
        <Modal onClose={closeModals}>
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Attendance Details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Full information for this attendance record.
              </p>
            </div>
            <button
              onClick={closeModals}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <RecordDetails record={viewRecord} />

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                onClick={closeModals}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewRecord(null);
                  openEditModal(viewRecord);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Pencil size={16} />
                Edit Record
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editRecord && (
        <Modal onClose={closeModals}>
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Edit Attendance
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the date, section, status, or reason.
              </p>
            </div>
            <button
              onClick={closeModals}
              disabled={saving}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Close edit form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Student
                </label>
                <input
                  value={getStudentName(editRecord.student)}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Class
                </label>
                <input
                  value={getClassName(editRecord.attendanceclass)}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="section"
                  value={editForm.section}
                  onChange={handleEditChange}
                  required
                  maxLength={30}
                  placeholder="Enter section"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Attendance Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Reason / Remarks
                </label>
                <textarea
                  name="reason"
                  value={editForm.reason}
                  onChange={handleEditChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Enter reason or remarks (optional)"
                  className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {actionError && (
              <ErrorMessage
                message={actionError}
                onClose={() => setActionError("")}
              />
            )}

            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={closeModals}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <LoaderCircle size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteRecord && (
        <Modal onClose={closeModals} size="sm">
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={30} className="text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Delete Attendance?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete the attendance record for{" "}
              <span className="font-semibold text-gray-800">
                {getStudentName(deleteRecord.student)}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-left text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Class:</span>{" "}
                {getClassName(deleteRecord.attendanceclass)}
              </p>
              <p className="mt-1 text-gray-600">
                <span className="font-medium text-gray-800">Date:</span>{" "}
                {formatDate(deleteRecord.date)}
              </p>
              <p className="mt-1 text-gray-600">
                <span className="font-medium text-gray-800">Status:</span>{" "}
                {normalizeStatus(deleteRecord.status)}
              </p>
            </div>

            {actionError && (
              <div className="mt-4 text-left">
                <ErrorMessage
                  message={actionError}
                  onClose={() => setActionError("")}
                />
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={closeModals}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}

function ErrorMessage({ message, onClose }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto shrink-0"
        aria-label="Dismiss error"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function Modal({ children, onClose, size = "lg" }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`my-auto w-full ${
          size === "sm" ? "max-w-md" : "max-w-2xl"
        } overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
}

export default AttendanceHistory;
