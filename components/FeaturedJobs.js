import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
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
    };

    fetchJobs();
  }, [currentFilter, currentSort]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIdx, startIdx + jobsPerPage);

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

  return (
    <section className="featured-jobs" id="jobs" aria-labelledby="jobs-heading">
      <div className="container">
        <h2 id="jobs-heading">Featured Jobs in Kenya</h2>
        <div className="job-controls">
          <div className="job-filters" role="tablist">
            {['all', 'Construction', 'Farming', 'Cleaning', 'Transport', 'Gardening'].map(filter => (
              <button
                key={filter}
                className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                data-filter={filter}
                role="tab"
                aria-selected={currentFilter === filter}
                onClick={() => setCurrentFilter(filter)}
              >
                {filter === 'all' ? 'All' : filter}
              </button>
            ))}
          </div>
          <div className="job-sort">
            <label htmlFor="sortJobs">Sort by:</label>
            <select 
              id="sortJobs" 
              aria-label="Sort job listings"
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="pay-high">Highest Pay</option>
              <option value="pay-low">Lowest Pay</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>
        </div>
        <div className="job-listings" aria-live="polite">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map(job => (
              <div key={job.id} className="job-card" data-id={job.id}>
                <h3>{job.title}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                <p><i className="fas fa-money-bill-wave"></i> KSH {job.pay}/{job.payPeriod}</p>
                <p><i className="fas fa-clock"></i> {formatDate(job.createdAt)}</p>
                <div className="job-tags">
                  <span className="job-type">{job.jobCategory}</span>
                  {job.requirements && job.requirements.slice(0, 2).map((req, index) => (
                    <span key={index} className="job-req">{req}</span>
                  ))}
                </div>
                <button className="btn btn-primary view-job" data-id={job.id}>View Details</button>
                <button className="btn btn-secondary save-job" data-id={job.id}>Save Job</button>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              <i className="fas fa-search"></i>
              <p>No jobs found</p>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="pagination" aria-label="Pagination controls">
            <button 
              className={`btn ${currentPage === 1 ? 'disabled' : ''}`} 
              id="prevPage"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              className={`btn ${currentPage === totalPages ? 'disabled' : ''}`} 
              id="nextPage"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
        <div className="view-all">
          <button className="btn btn-view-all" aria-label="View all jobs">View All Jobs</button>
        </div>
      </div>
    </section>
  );
}