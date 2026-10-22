import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  CalendarDays,
  History,
  ArrowRight,
} from "lucide-react";

const attendanceOptions = [
  {
    title: "Attendance Dashboard",
    description:
      "View daily attendance, present and absent students, absence reasons, and class-wise attendance statistics.",
    icon: ClipboardCheck,
    path: "/attendance/dashboard",
    iconStyle: "bg-blue-100 text-blue-600",
  },
  {
    title: "Monthly Attendance Report",
    description:
      "Review each student's monthly present days, absent days, leave records, and attendance percentage.",
    icon: CalendarDays,
    path: "/attendance/monthly-report",
    iconStyle: "bg-purple-100 text-purple-600",
  },
  {
    title: "Attendance History",
    description:
      "Search previous attendance records by date, class, section, or student name.",
    icon: History,
    path: "/attendance/history",
    iconStyle: "bg-emerald-100 text-emerald-600",
  },
];

const AttendanceHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Attendance Management
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage daily attendance, monthly reports, and student
            attendance history from one place.
          </p>
        </div>

        {/* Attendance Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {attendanceOptions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                onClick={() => navigate(item.path)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    navigate(item.path);
                  }
                }}
                role="link"
                tabIndex={0}
                aria-label={`Open ${item.title}`}
                className="group flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${item.iconStyle}`}
                >
                  <Icon size={28} />
                </div>

                {/* Card Content */}
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                {/* Navigation Link */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-blue-600">
                    View Details
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-blue-600 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AttendanceHome;