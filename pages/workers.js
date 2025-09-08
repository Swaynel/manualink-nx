import { useState, useEffect } from 'react';
import Head from 'next/head';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill: 'all',
    experience: 'all',
    location: 'all',
    sort: 'rating'
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        let workersQuery = collection(db, 'users');
        workersQuery = query(workersQuery, where('userType', '==', 'worker'));
        
        // Apply sorting
        if (filters.sort === 'rating') {
          workersQuery = query(workersQuery, orderBy('profile.rating', 'desc'));
        } else if (filters.sort === 'experience') {
          workersQuery = query(workersQuery, orderBy('profile.experience', 'desc'));
        }
        
        const querySnapshot = await getDocs(workersQuery);
        const workersData = [];
        querySnapshot.forEach((doc) => {
          workersData.push({ id: doc.id, ...doc.data() });
        });
        
        // Apply additional filters
        let filteredWorkers = workersData;
        
        if (filters.skill !== 'all') {
          filteredWorkers = filteredWorkers.filter(worker => 
            worker.profile?.skills?.includes(filters.skill)
          );
        }
        
        if (filters.experience !== 'all') {
          filteredWorkers = filteredWorkers.filter(worker => 
            worker.profile?.experience === filters.experience
          );
        }
        
        if (filters.location !== 'all') {
          filteredWorkers = filteredWorkers.filter(worker => 
            worker.profile?.location === filters.location
          );
        }
        
        setWorkers(filteredWorkers);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const renderRatingStars = (rating) => {
    if (!rating) return 'No ratings yet';
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star text-yellow-400"></i>
        ))}
        {halfStar && <i className="fas fa-star-half-alt text-yellow-400"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={i} className="far fa-star text-yellow-400"></i>
        ))}
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner"></div>
            <span className="ml-2">Loading workers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Find Workers - ManuaLink</title>
        <meta name="description" content="Browse skilled manual workers available for hire in Kenya." />
      </Head>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-2">Find Skilled Workers</h1>
          <p className="text-gray-600 text-center mb-8">Connect with reliable manual workers across Kenya</p>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <select 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={filters.skill}
                  onChange={(e) => handleFilterChange('skill', e.target.value)}
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
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
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
                  onChange={(e) => handleFilterChange('location', e.target.value)}
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
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.length > 0 ? (
              workers.map(worker => (
                <div key={worker.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <i className="fas fa-user text-3xl text-gray-500"></i>
                    </div>
                    <h2 className="text-xl font-semibold">{worker.name}</h2>
                    <p className="text-gray-600">{worker.profile?.location || 'Location not specified'}</p>
                  </div>
                  
                  <div className="mb-4">
                    {renderRatingStars(worker.profile?.rating)}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-1">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {worker.profile?.skills?.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                          {skill}
                        </span>
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
                  
                  <button className="btn btn-primary w-full">Contact Worker</button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">No workers found matching your criteria</p>
              </div>
            )}
          </div>
          
          {/* How to Hire Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How to Hire a Worker</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Browse Workers</h3>
                <p className="text-gray-600">Search through our database of skilled workers and view their profiles, ratings, and experience.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Contact Directly</h3>
                <p className="text-gray-600">Reach out to workers you are interested in to discuss your project details and requirements.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Hire & Review</h3>
                <p className="text-gray-600">Agree on terms, complete the work, and leave a review to help other employers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
