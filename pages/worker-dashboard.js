import { useState, useEffect, useMemo } from "react";
import SharedModal from "../components/SharedModal";
import SharedModalContent from "../components/SharedModalContent";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

// Format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date)
    ? "-"
    : date.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

// Reusable DataTable Component
const DataTable = ({ columns, data }) => (
  <div className="overflow-x-auto bg-white rounded shadow border">
    <table className="w-full min-w-max">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-6 py-3 text-left text-sm font-medium text-gray-500"
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let end = Math.min(totalPages, start + maxPages - 1);
  if (end - start + 1 < maxPages) start = Math.max(1, end - maxPages + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${
            currentPage === p ? "bg-blue-600 text-white" : ""
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default function WorkersDashboard({ currentWorkerId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [modalData, setModalData] = useState({ show: false, type: "", data: null });

  const [jobsPage, setJobsPage] = useState(1);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const itemsPerPage = 5;

  const [jobSearch, setJobSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");

  // ✅ Fixed useEffect to avoid stale state and satisfy linter
  useEffect(() => {
    if (!currentWorkerId) return;
    setLoading(true);

    let latestJobs = [];
    let latestApplications = [];

    const jobsUnsub = onSnapshot(
      query(collection(db, "jobs"), orderBy("datePosted", "desc")),
      (snapshot) => {
        latestJobs = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (job) =>
              job.assignedWorkerId === currentWorkerId ||
              job.applicants?.includes(currentWorkerId)
          );
        setMyJobs(latestJobs);
        updateStats(latestJobs, latestApplications);
        setLoading(false);
      }
    );

    const appsUnsub = onSnapshot(
      query(collection(db, "applications"), orderBy("appliedDate", "desc")),
      (snapshot) => {
        latestApplications = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((app) => app.workerId === currentWorkerId);
        setMyApplications(latestApplications);
        updateStats(latestJobs, latestApplications);
      }
    );

    return () => {
      jobsUnsub();
      appsUnsub();
    };
  }, [currentWorkerId]);

  const updateStats = (jobs, applications) => {
    setStats({
      activeJobs: jobs.filter((j) => j.status === "active").length,
      completedJobs: jobs.filter((j) => j.status === "completed").length,
      totalApplications: applications.length,
      pendingReviews: applications.filter((a) => a.status === "pending").length,
    });
  };

  const openModal = (type, data) => setModalData({ show: true, type, data });
  const closeModal = () => setModalData({ show: false, type: "", data: null });

  const filteredJobs = useMemo(
    () =>
      myJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
          j.location.toLowerCase().includes(jobSearch.toLowerCase())
      ),
    [myJobs, jobSearch]
  );

  const filteredApplications = useMemo(
    () =>
      myApplications.filter((a) =>
        a.jobTitle.toLowerCase().includes(applicationSearch.toLowerCase())
      ),
    [myApplications, applicationSearch]
  );

  const paginatedJobs = filteredJobs.slice((jobsPage - 1) * itemsPerPage, jobsPage * itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (applicationsPage - 1) * itemsPerPage,
    applicationsPage * itemsPerPage
  );

  const jobColumns = [
    { key: "title", title: "Job Title", render: (j) => <p className="font-medium">{j.title}</p> },
    { key: "location", title: "Location" },
    {
      key: "status",
      title: "Status",
      render: (j) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            j.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {j.status}
        </span>
      ),
    },
  ];

  const applicationColumns = [
    { key: "jobTitle", title: "Job" },
    { key: "experience", title: "Experience" },
    { key: "appliedDate", title: "Applied Date", render: (a) => formatDate(a.appliedDate) },
    {
      key: "status",
      title: "Status",
      render: (a) => (
        <button
          onClick={() => openModal("application", a)}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            a.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
          }`}
        >
          {a.status}
        </button>
      ),
    },
  ];

  const renderContent = () => {
    if (loading)
      return <div className="p-8 text-center bg-white rounded shadow">Loading dashboard...</div>;

    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeJobs}</p>
              </div>
              💼
            </div>
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Completed Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p>
              </div>
              ✅
            </div>
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalApplications}</p>
              </div>
              📋
            </div>
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
              </div>
              ⏰
            </div>
          </div>
        );
      case "jobs":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">My Jobs</h2>
            <input
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="Search jobs..."
              className="mb-4 w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
            <DataTable columns={jobColumns} data={paginatedJobs} />
            <Pagination
              currentPage={jobsPage}
              totalPages={Math.ceil(filteredJobs.length / itemsPerPage)}
              onPageChange={setJobsPage}
            />
          </>
        );
      case "applications":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">My Applications</h2>
            <input
              value={applicationSearch}
              onChange={(e) => setApplicationSearch(e.target.value)}
              placeholder="Search applications..."
              className="mb-4 w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
            <DataTable columns={applicationColumns} data={paginatedApplications} />
            <Pagination
              currentPage={applicationsPage}
              totalPages={Math.ceil(filteredApplications.length / itemsPerPage)}
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
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600">Track your jobs and applications</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded shadow border p-4">
            <ul className="space-y-2">
              {["overview", "jobs", "applications"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded ${
                      activeTab === tab
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
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

      {/* Modal */}
      <SharedModal show={modalData.show} onClose={closeModal} title="">
        <SharedModalContent type={modalData.type} data={modalData.data} />
      </SharedModal>
    </div>
  );
}
