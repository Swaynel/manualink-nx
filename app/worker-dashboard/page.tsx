"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import SharedModal from "../../components/SharedModal";
import SharedModalContent from "../../components/SharedModalContent";
import { useAppShell } from "../../components/AppShell";
import { db } from "../../lib/firebase";
import type { ApplicationDocument, JobDocument } from "../../types/app";

type WorkerTab = "overview" | "jobs" | "applications";

interface WorkerStats {
  activeJobs: number;
  completedJobs: number;
  totalApplications: number;
  pendingReviews: number;
}

interface WorkerModalState {
  show: boolean;
  type: "application";
  data: ApplicationDocument | null;
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

function DataTable<T extends { id: string }>({
  columns,
  data,
}: {
  columns: TableColumn<T>[];
  data: T[];
}) {
  return (
    <div className="overflow-x-auto rounded border bg-white shadow">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-sm font-medium text-gray-500"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
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

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: number[] = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
  const end = Math.min(totalPages, start + maxPages - 1);

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }

  for (let index = start; index <= end; index += 1) {
    pages.push(index);
  }

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded border px-3 py-1 ${
            currentPage === page ? "bg-blue-600 text-white" : ""
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function WorkerDashboardPage() {
  const { currentUser } = useAppShell();
  const currentWorkerId = currentUser?.uid ?? null;

  const [activeTab, setActiveTab] = useState<WorkerTab>("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WorkerStats>({
    activeJobs: 0,
    completedJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
  });
  const [myJobs, setMyJobs] = useState<JobDocument[]>([]);
  const [myApplications, setMyApplications] = useState<ApplicationDocument[]>([]);
  const [modalData, setModalData] = useState<WorkerModalState>({
    show: false,
    type: "application",
    data: null,
  });
  const [jobsPage, setJobsPage] = useState(1);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [jobSearch, setJobSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    if (!currentWorkerId) {
      setLoading(false);
      setMyJobs([]);
      setMyApplications([]);
      return;
    }

    setLoading(true);

    let latestJobs: JobDocument[] = [];
    let latestApplications: ApplicationDocument[] = [];

    const updateStats = (
      jobs: JobDocument[],
      applications: ApplicationDocument[],
    ) => {
      setStats({
        activeJobs: jobs.filter((job) => job.status === "active").length,
        completedJobs: jobs.filter((job) => job.status === "completed").length,
        totalApplications: applications.length,
        pendingReviews: applications.filter(
          (application) => application.status === "pending",
        ).length,
      });
    };

    const jobsUnsubscribe = onSnapshot(
      query(collection(db, "jobs"), orderBy("datePosted", "desc")),
      (snapshot) => {
        latestJobs = snapshot.docs
          .map((documentSnapshot) => ({
            id: documentSnapshot.id,
            ...(documentSnapshot.data() as Omit<JobDocument, "id">),
          }))
          .filter(
            (job) =>
              job.assignedWorkerId === currentWorkerId ||
              job.applicants?.includes(currentWorkerId),
          );

        setMyJobs(latestJobs);
        updateStats(latestJobs, latestApplications);
        setLoading(false);
      },
    );

    const applicationsUnsubscribe = onSnapshot(
      query(collection(db, "applications"), orderBy("appliedDate", "desc")),
      (snapshot) => {
        latestApplications = snapshot.docs
          .map((documentSnapshot) => ({
            id: documentSnapshot.id,
            ...(documentSnapshot.data() as Omit<ApplicationDocument, "id">),
          }))
          .filter((application) => application.workerId === currentWorkerId);

        setMyApplications(latestApplications);
        updateStats(latestJobs, latestApplications);
      },
    );

    return () => {
      jobsUnsubscribe();
      applicationsUnsubscribe();
    };
  }, [currentWorkerId]);

  const openModal = (data: ApplicationDocument) => {
    setModalData({ show: true, type: "application", data });
  };

  const closeModal = () => {
    setModalData({ show: false, type: "application", data: null });
  };

  const filteredJobs = useMemo(
    () =>
      myJobs.filter((job) => {
        const searchValue = jobSearch.toLowerCase();
        return (
          (job.title ?? "").toLowerCase().includes(searchValue) ||
          (job.location ?? "").toLowerCase().includes(searchValue)
        );
      }),
    [jobSearch, myJobs],
  );

  const filteredApplications = useMemo(
    () =>
      myApplications.filter((application) =>
        (application.jobTitle ?? "")
          .toLowerCase()
          .includes(applicationSearch.toLowerCase()),
      ),
    [applicationSearch, myApplications],
  );

  const paginatedJobs = filteredJobs.slice(
    (jobsPage - 1) * itemsPerPage,
    jobsPage * itemsPerPage,
  );
  const paginatedApplications = filteredApplications.slice(
    (applicationsPage - 1) * itemsPerPage,
    applicationsPage * itemsPerPage,
  );

  const jobColumns: TableColumn<JobDocument>[] = [
    {
      key: "title",
      title: "Job Title",
      render: (job) => <p className="font-medium">{job.title ?? "Untitled job"}</p>,
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
  ];

  const applicationColumns: TableColumn<ApplicationDocument>[] = [
    {
      key: "jobTitle",
      title: "Job",
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
        <button
          onClick={() => openModal(application)}
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            application.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {application.status ?? "unknown"}
        </button>
      ),
    },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="rounded bg-white p-8 text-center shadow">Loading dashboard...</div>;
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Active Jobs",
                value: stats.activeJobs,
                color: "text-blue-600",
                icon: "fa-briefcase",
              },
              {
                label: "Completed Jobs",
                value: stats.completedJobs,
                color: "text-green-600",
                icon: "fa-check-circle",
              },
              {
                label: "Total Applications",
                value: stats.totalApplications,
                color: "text-purple-600",
                icon: "fa-clipboard-list",
              },
              {
                label: "Pending Reviews",
                value: stats.pendingReviews,
                color: "text-orange-600",
                icon: "fa-hourglass-half",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="flex items-center justify-between rounded bg-white p-6 shadow"
              >
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <i className={`fas ${card.icon} text-xl text-gray-400`} />
              </div>
            ))}
          </div>
        );
      case "jobs":
        return (
          <>
            <h2 className="mb-4 text-2xl font-bold">My Jobs</h2>
            <input
              value={jobSearch}
              onChange={(event) => setJobSearch(event.target.value)}
              placeholder="Search jobs..."
              className="mb-4 w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <DataTable columns={jobColumns} data={paginatedJobs} />
            <Pagination
              currentPage={jobsPage}
              totalPages={Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage))}
              onPageChange={setJobsPage}
            />
          </>
        );
      case "applications":
        return (
          <>
            <h2 className="mb-4 text-2xl font-bold">My Applications</h2>
            <input
              value={applicationSearch}
              onChange={(event) => setApplicationSearch(event.target.value)}
              placeholder="Search applications..."
              className="mb-4 w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <DataTable columns={applicationColumns} data={paginatedApplications} />
            <Pagination
              currentPage={applicationsPage}
              totalPages={Math.max(
                1,
                Math.ceil(filteredApplications.length / itemsPerPage),
              )}
              onPageChange={setApplicationsPage}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600">Track your jobs and applications</p>
          </div>
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-800">
            &larr; Back to Home
          </Link>
        </div>
      </div>

      {!currentWorkerId ? (
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded border bg-white p-8 text-center shadow">
            <h2 className="mb-2 text-xl font-semibold">Sign in to view your dashboard</h2>
            <p className="text-gray-600">
              Your worker jobs and application history will appear here once you are logged in.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
          <div className="lg:w-64 lg:flex-shrink-0">
            <nav className="rounded border bg-white p-4 shadow">
              <ul className="space-y-2">
                {(["overview", "jobs", "applications"] as WorkerTab[]).map((tab) => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`w-full rounded px-4 py-3 text-left ${
                        activeTab === tab
                          ? "border border-blue-200 bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex-1">{renderContent()}</div>
        </div>
      )}

      <SharedModal show={modalData.show} onClose={closeModal} title="">
        <SharedModalContent type={modalData.type} data={modalData.data} />
      </SharedModal>
    </div>
  );
}
