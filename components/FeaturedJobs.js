import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Filters options
  const filters = ['all', 'Construction', 'Farming', 'Cleaning', 'Transport', 'Gardening'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Base collection
        let jobsCollection = collection(db, 'jobs');
        let jobsQuery = jobsCollection;

        // Filter locally to avoid requiring Firestore composite indexes for every combination
        const snapshot = await getDocs(jobsCollection);
        let jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Apply filter locally
        if (currentFilter !== 'all') {
          jobsData = jobsData.filter(job => job.jobCategory === currentFilter);
        }

        // Apply sort locally
        jobsData.sort((a, b) => {
          switch (currentSort) {
            case 'pay-high': return b.pay - a.pay;
            case 'pay-low': return a.pay - b.pay;
            case 'newest': return b.createdAt?.toDate() - a.createdAt?.toDate();
            case 'oldest': return a.createdAt?.toDate() - b.createdAt?.toDate();
            default: return b.createdAt?.toDate() - a.createdAt?.toDate();
          }
        });

        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
    setCurrentPage(1); // Reset page on filter/sort change
  }, [currentFilter, currentSort]);

  // Pagination
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIdx, startIdx + jobsPerPage);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Invalid Date';
    const date = timestamp.toDate();
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="py-16 bg-gray-50" id="jobs" aria-labelledby="jobs-heading">
      <div className="container mx-auto px-4">
        <h2 id="jobs-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Featured Jobs in Kenya
        </h2>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2" role="tablist">
            {filters.map(filter => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  currentFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                role="tab"
                aria-selected={currentFilter === filter}
                onClick={() => setCurrentFilter(filter)}
              >
                {filter === 'all' ? 'All' : filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sortJobs" className="text-gray-700 font-medium">Sort by:</label>
            <select
              id="sortJobs"
              aria-label="Sort job listings"
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="pay-high">Highest Pay</option>
              <option value="pay-low">Lowest Pay</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <p className="text-gray-500 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt"></i> {job.location}
                </p>
                <p className="text-gray-500 flex items-center gap-2">
                  <i className="fas fa-money-bill-wave"></i> KSH {job.pay}/{job.payPeriod}
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <i className="fas fa-clock"></i> {formatDate(job.createdAt)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{job.jobCategory}</span>
                  {job.requirements?.slice(0, 2).map((req, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">{req}</span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
                    Save Job
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-12">
              <i className="fas fa-search text-3xl mb-2"></i>
              <p>No jobs found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md font-medium transition ${
                  currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left mr-1"></i> Previous
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition ${
                  currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-8">
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}
