import type { ReactNode } from "react";
import type { ApplicationDocument, JobDocument } from "../types/app";

type SharedModalContentType = "job" | "application" | "workerPerformance";

interface WorkerPerformanceRow {
  id?: string;
  workerName?: string;
  completedJobs?: number;
  activeJobs?: number;
  rating?: number | null;
}

interface SharedModalContentProps {
  type: SharedModalContentType;
  data:
    | JobDocument
    | ApplicationDocument
    | WorkerPerformanceRow
    | JobDocument[]
    | ApplicationDocument[]
    | WorkerPerformanceRow[]
    | null;
}

interface TableColumn<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function DataTable<T extends { id?: string }>({
  columns,
  data,
}: {
  columns: TableColumn<T>[];
  data: T[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id ?? index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SharedModalContent({
  type,
  data,
}: SharedModalContentProps) {
  if (!data) {
    return <p className="text-gray-500">No data available</p>;
  }

  if (type === "job") {
    const displayData = (Array.isArray(data) ? data : [data]) as JobDocument[];
    const columns: TableColumn<JobDocument>[] = [
      {
        key: "title",
        title: "Job Title",
        render: (job) => <span className="font-medium">{job.title ?? "-"}</span>,
      },
      {
        key: "location",
        title: "Location",
        render: (job) => job.location ?? "-",
      },
      {
        key: "status",
        title: "Status",
        render: (job) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              job.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job.status ?? "unknown"}
          </span>
        ),
      },
      {
        key: "datePosted",
        title: "Posted On",
        render: (job) => formatDate(job.datePosted),
      },
    ];

    return <DataTable columns={columns} data={displayData} />;
  }

  if (type === "application") {
    const displayData = (Array.isArray(data) ? data : [data]) as ApplicationDocument[];
    const columns: TableColumn<ApplicationDocument>[] = [
      {
        key: "jobTitle",
        title: "Job Applied For",
        render: (application) => application.jobTitle ?? "-",
      },
      {
        key: "experience",
        title: "Experience",
        render: (application) => application.experience ?? "-",
      },
      {
        key: "appliedDate",
        title: "Applied Date",
        render: (application) => formatDate(application.appliedDate),
      },
      {
        key: "status",
        title: "Status",
        render: (application) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              application.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {application.status ?? "unknown"}
          </span>
        ),
      },
    ];

    return <DataTable columns={columns} data={displayData} />;
  }

  const displayData = (Array.isArray(data) ? data : [data]) as WorkerPerformanceRow[];
  const columns: TableColumn<WorkerPerformanceRow>[] = [
    {
      key: "workerName",
      title: "Worker Name",
      render: (worker) => worker.workerName ?? "-",
    },
    {
      key: "completedJobs",
      title: "Completed Jobs",
      render: (worker) => worker.completedJobs ?? 0,
    },
    {
      key: "activeJobs",
      title: "Active Jobs",
      render: (worker) => worker.activeJobs ?? 0,
    },
    {
      key: "rating",
      title: "Rating",
      render: (worker) => `${worker.rating ?? "-"} star(s)`,
    },
  ];

  return <DataTable columns={columns} data={displayData} />;
}
