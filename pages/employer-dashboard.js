import { useState, useEffect, useMemo } from "react";
import SharedModal from "../components/SharedModal";
import SharedModalContent from "../components/SharedModalContent";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "../lib/firebase";

// Format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date)
    ? "-"
    : date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
};

// DataTable Component
const DataTable = ({ columns, data }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
    <table className="w-full min-w-max">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item, idx) => (
          <tr key={item.id || idx}>
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
  const pages = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let end = Math.min(totalPages, start + maxPages - 1);
  if (end - start + 1 < maxPages) start = Math.max(1, end - maxPages + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === p
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function EmployerDashboard({ currentEmployerId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [modalData, setModalData] = useState({ show: false, type: "", data: null });

  const itemsPerPage = 5;
  const [jobsPage, setJobsPage] = useState(1);
  const [applicationsPage, setApplicationsPage] = useState(1);

  const [jobSearch, setJobSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");

  useEffect(() => {
    if (!currentEmployerId) return; // Guard undefined

    setLoading(true);

    const jobsUnsub = onSnapshot(
      query(collection(db, "jobs"), orderBy("datePosted", "desc"), where("employerId", "==", currentEmployerId)),
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMyJobs(jobsData);
        updateStats(jobsData, applications);
        setLoading(false);
      }
    );

    const applicationsUnsub = onSnapshot(
      query(collection(db, "applications"), orderBy("appliedDate", "desc")),
      (snapshot) => {
        const appsData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((app) => myJobs.some((job) => job.id === app.jobId)); // Only employer's jobs
        setApplications(appsData);
        updateStats(myJobs, appsData);
      }
    );

    return () => {
      jobsUnsub();
      applicationsUnsub();
    };
  }, [currentEmployerId, myJobs]);

  const updateStats = (jobs, applications) => {
    setStats({
      totalApplications: applications.length,
      activeJobs: jobs.filter((j) => j.status === "active").length,
      completedJobs: jobs.filter((j) => j.status === "completed").length,
      pendingApplications: applications.filter((a) => a.status === "pending").length,
    });
  };

  const openModal = (type, data) => setModalData({ show: true, type, data });
  const closeModal = () => setModalData({ show: false, type: "", data: null });

  const jobColumns = [
    { key: "title", title: "Job Title", render: (job) => <p className="font-medium">{job.title}</p> },
    { key: "location", title: "Location" },
    {
      key: "status",
      title: "Status",
      render: (job) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {job.status}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (job) => (
        <button
          onClick={() => openModal("job", job)}
          className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full"
        >
          View
        </button>
      ),
    },
  ];

  const applicationColumns = [
    { key: "workerName", title: "Worker Name" },
    { key: "jobTitle", title: "Job Applied For" },
    { key: "appliedDate", title: "Applied Date", render: (app) => formatDate(app.appliedDate) },
    {
      key: "status",
      title: "Status",
      render: (app) => (
        <button
          onClick={() => openModal("application", app)}
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            app.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
          }`}
        >
          {app.status}
        </button>
      ),
    },
  ];

  const filteredJobs = useMemo(
    () => myJobs.filter((j) => j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.location.toLowerCase().includes(jobSearch.toLowerCase())),
    [myJobs, jobSearch]
  );

  const filteredApplications = useMemo(
    () => applications.filter((a) => a.workerName.toLowerCase().includes(applicationSearch.toLowerCase())),
    [applications, applicationSearch]
  );

  const paginatedJobs = filteredJobs.slice((jobsPage - 1) * itemsPerPage, jobsPage * itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (applicationsPage - 1) * itemsPerPage,
    applicationsPage * itemsPerPage
  );

  const renderContent = () => {
    if (loading) return <div className="bg-white p-8 rounded-lg shadow-sm border text-center">Loading dashboard...</div>;

    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeJobs}</p>
              </div>
              <div>💼</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Completed Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p>
              </div>
              <div>✅</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalApplications}</p>
              </div>
              <div>📋</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Pending Applications</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</p>
              </div>
              <div>⏰</div>
            </div>
          </div>
        );
      case "jobs":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">My Jobs</h2>
            <input
              type="text"
              placeholder="Search jobs..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            <h2 className="text-2xl font-bold mb-4">Worker Applications</h2>
            <input
              type="text"
              placeholder="Search applications..."
              value={applicationSearch}
              onChange={(e) => setApplicationSearch(e.target.value)}
              className="mb-4 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">Track your jobs and worker applications</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg shadow-sm border p-4">
            <ul className="space-y-2">
              {["overview", "jobs", "applications"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
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

      <SharedModal show={modalData.show} onClose={closeModal} title="">
        <SharedModalContent type={modalData.type} data={modalData.data} />
      </SharedModal>
    </div>
  );
}
