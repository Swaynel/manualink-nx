import { useState, useEffect, useMemo } from "react";
import SharedModal from "../components/SharedModal";
import SharedModalContent from "../components/SharedModalContent";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "../lib/firebase";

// Format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? "-" : date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
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

  useEffect(() => {
    setLoading(true);

    const jobsUnsub = onSnapshot(
      query(collection(db, "jobs"), orderBy("datePosted", "desc")),
      (snapshot) => {
        const jobsData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(job => job.assignedWorkerId === currentWorkerId || job.applicants?.includes(currentWorkerId));
        setMyJobs(jobsData);
        updateStats(jobsData, myApplications);
        setLoading(false);
      }
    );

    const appsUnsub = onSnapshot(
      query(collection(db, "applications"), orderBy("appliedDate", "desc")),
      (snapshot) => {
        const appsData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(app => app.workerId === currentWorkerId); // safe filter to avoid undefined
        setMyApplications(appsData);
        updateStats(myJobs, appsData);
      }
    );

    return () => {
      jobsUnsub();
      appsUnsub();
    };
  }, [currentWorkerId]);

  const updateStats = (jobs, applications) => {
    setStats({
      activeJobs: jobs.filter(j => j.status === "active").length,
      completedJobs: jobs.filter(j => j.status === "completed").length,
      totalApplications: applications.length,
      pendingReviews: applications.filter(a => a.status === "pending").length,
    });
  };

  const openModal = (type, data) => setModalData({ show: true, type, data });
  const closeModal = () => setModalData({ show: false, type: "", data: null });

  const filteredJobs = useMemo(() => myJobs.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
    j.location.toLowerCase().includes(jobSearch.toLowerCase())
  ), [myJobs, jobSearch]);

  const filteredApplications = useMemo(() => myApplications.filter(a =>
    a.jobTitle.toLowerCase().includes(applicationSearch.toLowerCase())
  ), [myApplications, applicationSearch]);

  const paginatedJobs = filteredJobs.slice((jobsPage-1)*itemsPerPage, jobsPage*itemsPerPage);
  const paginatedApplications = filteredApplications.slice((applicationsPage-1)*itemsPerPage, applicationsPage*itemsPerPage);

  const renderPagination = (page, totalItems, setPage) => {
    const totalPages = Math.ceil(totalItems/itemsPerPage);
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i=1; i<=totalPages; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button onClick={()=>setPage(page-1)} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        {pages.map(p=>(
          <button key={p} onClick={()=>setPage(p)} className={`px-3 py-1 border rounded ${page===p?'bg-blue-600 text-white':''}`}>{p}</button>
        ))}
        <button onClick={()=>setPage(page+1)} disabled={page===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) return <div className="p-8 text-center bg-white rounded shadow">Loading dashboard...</div>;

    switch(activeTab){
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div><p className="text-gray-500 text-sm">Active Jobs</p><p className="text-2xl font-bold text-blue-600">{stats.activeJobs}</p></div>💼
            </div>
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div><p className="text-gray-500 text-sm">Completed Jobs</p><p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p></div>✅
            </div>
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div><p className="text-gray-500 text-sm">Total Applications</p><p className="text-2xl font-bold text-purple-600">{stats.totalApplications}</p></div>📋
            </div>
            <div className="bg-white p-6 rounded shadow flex justify-between items-center">
              <div><p className="text-gray-500 text-sm">Pending Reviews</p><p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p></div>⏰
            </div>
          </div>
        )
      case "jobs":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">My Jobs</h2>
            <input value={jobSearch} onChange={e=>setJobSearch(e.target.value)} placeholder="Search jobs..." className="mb-4 w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"/>
            <div className="overflow-x-auto bg-white rounded shadow border">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50"><tr>
                  <th className="px-6 py-3 text-left">Job Title</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedJobs.map(job=>(
                    <tr key={job.id}>
                      <td className="px-6 py-4 font-medium">{job.title}</td>
                      <td className="px-6 py-4">{job.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${job.status==="active"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}`}>{job.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(jobsPage, filteredJobs.length, setJobsPage)}
          </>
        )
      case "applications":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">My Applications</h2>
            <input value={applicationSearch} onChange={e=>setApplicationSearch(e.target.value)} placeholder="Search applications..." className="mb-4 w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"/>
            <div className="overflow-x-auto bg-white rounded shadow border">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50"><tr>
                  <th className="px-6 py-3 text-left">Job</th>
                  <th className="px-6 py-3 text-left">Experience</th>
                  <th className="px-6 py-3 text-left">Applied Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedApplications.map(app=>(
                    <tr key={app.id}>
                      <td className="px-6 py-4">{app.jobTitle}</td>
                      <td className="px-6 py-4">{app.experience}</td>
                      <td className="px-6 py-4">{formatDate(app.appliedDate)}</td>
                      <td className="px-6 py-4">
                        <button onClick={()=>openModal("application", app)} className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status==="pending"?"bg-yellow-100 text-yellow-800":"bg-blue-100 text-blue-800"}`}>
                          {app.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(applicationsPage, filteredApplications.length, setApplicationsPage)}
          </>
        )
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600">Track your jobs and applications</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded shadow border p-4">
            <ul className="space-y-2">
              {["overview","jobs","applications"].map(tab=>(
                <li key={tab}>
                  <button onClick={()=>setActiveTab(tab)} className={`w-full text-left px-4 py-3 rounded ${activeTab===tab?'bg-blue-50 text-blue-700 border border-blue-200':'text-gray-700 hover:bg-gray-50'}`}>
                    {tab.charAt(0).toUpperCase()+tab.slice(1)}
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
  )
}
