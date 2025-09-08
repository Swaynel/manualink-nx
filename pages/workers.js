import { useState, useEffect } from 'react';
import Head from 'next/head';
import { collection, getDocs, query, where, orderBy, startAfter, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill: 'all',
    experience: 'all',
    location: 'all',
    sort: 'rating',
  });
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const WORKERS_PER_PAGE = 6;

  const fetchWorkers = async (loadMore = false) => {
    try {
      if (!loadMore) setLoading(true);
      else setLoadingMore(true);

      let constraints = [where('userType', '==', 'worker')];

      if (filters.sort === 'rating') constraints.push(orderBy('profile.rating', 'desc'));
      if (filters.sort === 'experience') constraints.push(orderBy('profile.experience', 'desc'));
      if (loadMore && lastDoc) constraints.push(startAfter(lastDoc));
      constraints.push(limit(WORKERS_PER_PAGE));

      const workersQuery = query(collection(db, 'users'), ...constraints);
      const snapshot = await getDocs(workersQuery);
      const workersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || lastDoc);

      let filtered = workersData;
      if (filters.skill !== 'all') filtered = filtered.filter(w => w.profile?.skills?.includes(filters.skill));
      if (filters.experience !== 'all') filtered = filtered.filter(w => w.profile?.experience === filters.experience);
      if (filters.location !== 'all') filtered = filtered.filter(w => w.profile?.location === filters.location);

      if (loadMore) setWorkers(prev => [...prev, ...filtered]);
      else setWorkers(filtered);
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to fetch workers.' });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLastDoc(null);
    fetchWorkers();
  }, [filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const renderRatingStars = rating => {
    if (!rating) return 'No ratings yet';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="flex items-center justify-center md:justify-start">
        {[...Array(full)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400"></i>)}
        {half && <i className="fas fa-star-half-alt text-yellow-400"></i>}
        {[...Array(empty)].map((_, i) => <i key={i} className="far fa-star text-yellow-400"></i>)}
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const contactWorker = workerName => {
    setFeedback({ type: 'success', message: `You contacted ${workerName}!` });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <>
      <Head>
        <title>Find Workers - ManuaLink</title>
        <meta name="description" content="Browse skilled manual workers available for hire in Kenya." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2">Find Skilled Workers</h1>
          <p className="text-gray-600 text-center mb-8">Connect with reliable manual workers across Kenya</p>

          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4 text-right">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setFiltersOpen(prev => !prev)}
            >
              {filtersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          <div className={`${filtersOpen ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow-md p-6 mb-8`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={filters.skill}
                  onChange={e => handleFilterChange('skill', e.target.value)}
                >
                  <option value="all">All Skills</option>
                  <option value="Construction">Construction</option>
                  <option value="Farming">Farming</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Transport">Transport</option>
                  <option value="Gardening">Gardening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={filters.experience}
                  onChange={e => handleFilterChange('experience', e.target.value)}
                >
                  <option value="all">All Experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={filters.location}
                  onChange={e => handleFilterChange('location', e.target.value)}
                >
                  <option value="all">All Locations</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={filters.sort}
                  onChange={e => handleFilterChange('sort', e.target.value)}
                >
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className={`mb-4 p-4 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.message}
            </div>
          )}

          {/* Workers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(WORKERS_PER_PAGE)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 mb-4 rounded"></div>
                  <div className="h-4 bg-gray-300 mb-2 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 mb-2 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {workers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workers.map(worker => (
                    <div key={worker.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <i className="fas fa-user text-3xl text-gray-500"></i>
                        </div>
                        <h2 className="text-xl font-semibold">{worker.name}</h2>
                        <p className="text-gray-600">{worker.profile?.location || 'Location not specified'}</p>
                      </div>

                      <div className="mb-4">{renderRatingStars(worker.profile?.rating)}</div>

                      <div className="mb-4">
                        <h3 className="font-medium mb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {worker.profile?.skills?.map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">{skill}</span>
                          )) || <span className="text-gray-500">No skills listed</span>}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-medium mb-1">Experience</h3>
                        <p className="text-gray-600">{worker.profile?.experience || 'Not specified'}</p>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-medium mb-1">Availability</h3>
                        <p className="text-gray-600">{worker.profile?.availability || 'Not specified'}</p>
                      </div>

                      {worker.profile?.hourlyRate && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-1">Hourly Rate</h3>
                          <p className="text-gray-600">KSH {worker.profile.hourlyRate}/hr</p>
                        </div>
                      )}

                      <button
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={() => contactWorker(worker.name)}
                      >
                        Contact Worker
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-12">
                  <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600">No workers found matching your criteria</p>
                </div>
              )}

              {/* Load More Button */}
              {lastDoc && !loadingMore && (
                <div className="text-center mt-6">
                  <button
                    className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick={() => fetchWorkers(true)}
                  >
                    Load More
                  </button>
                </div>
              )}

              {loadingMore && (
                <div className="text-center mt-6 text-gray-500">Loading more workers...</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
