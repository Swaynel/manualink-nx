import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let jobsQuery = collection(db, 'jobs');
        
        if (currentFilter !== 'all') {
          jobsQuery = query(jobsQuery, where('jobCategory', '==', currentFilter));
        }
        
        switch (currentSort) {
          case 'pay-high': 
            jobsQuery = query(jobsQuery, orderBy('pay', 'desc')); 
            break;
          case 'pay-low': 
            jobsQuery = query(jobsQuery, orderBy('pay', 'asc')); 
            break;
          case 'newest': 
            jobsQuery = query(jobsQuery, orderBy('createdAt', 'desc')); 
            break;
          case 'oldest': 
            jobsQuery = query(jobsQuery, orderBy('createdAt', 'asc')); 
            break;
          default: 
            jobsQuery = query(jobsQuery, orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = [];
        querySnapshot.forEach((doc) => {
          jobsData.push({ id: doc.id, ...doc.data() });
        });
        
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentFilter, currentSort]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Invalid Date';
    const date = timestamp.toDate();
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIdx, startIdx + jobsPerPage);

  if (loading) {
    return (
      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner"></div>
            <span className="ml-2">Loading jobs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">All Job Listings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="job-filters flex flex-wrap gap-2">
              {['all', 'Construction', 'Farming', 'Cleaning', 'Transport', 'Gardening'].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentFilter(filter);
                    setCurrentPage(1);
                  }}
                >
                  {filter === 'all' ? 'All' : filter}
                </button>
              ))}
            </div>
            
            <div className="job-sort flex items-center gap-2">
              <label htmlFor="sortJobs" className="text-sm font-medium">Sort by:</label>
              <select 
                id="sortJobs" 
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="pay-high">Highest Pay</option>
                <option value="pay-low">Lowest Pay</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <span><i className="fas fa-map-marker-alt mr-1"></i> {job.location}</span>
                        <span><i className="fas fa-money-bill-wave mr-1"></i> KSH {job.pay}/{job.payPeriod}</span>
                        <span><i className="fas fa-clock mr-1"></i> {formatDate(job.createdAt)}</span>
                      </div>
                      <div className="job-tags">
                        <span className="job-type">{job.jobCategory}</span>
                        {job.requirements && job.requirements.slice(0, 2).map((req, index) => (
                          <span key={index} className="job-req">{req}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-primary">View Details</button>
                      <button className="btn btn-secondary">Save Job</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">No jobs found matching your criteria</p>
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left mr-1"></i> Previous
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button 
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}