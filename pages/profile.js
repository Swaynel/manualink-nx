import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      
      setUser(user);
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Load saved jobs
          if (data.savedJobs && data.savedJobs.length > 0) {
            const savedJobsData = [];
            for (const jobId of data.savedJobs) {
              const jobDoc = await getDoc(doc(db, 'jobs', jobId));
              if (jobDoc.exists()) {
                savedJobsData.push({ id: jobDoc.id, ...jobDoc.data() });
              }
            }
            setSavedJobs(savedJobsData);
          }
          
          // Load applied jobs
          const applicationsQuery = query(
            collection(db, 'applications'),
            where('userId', '==', user.uid)
          );
          const applicationsSnapshot = await getDocs(applicationsQuery);
          const appliedJobsData = [];
          
          for (const appDoc of applicationsSnapshot.docs) {
            const appData = appDoc.data();
            const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
            if (jobDoc.exists()) {
              appliedJobsData.push({
                applicationId: appDoc.id,
                ...appData,
                job: { id: jobDoc.id, ...jobDoc.data() }
              });
            }
          }
          setAppliedJobs(appliedJobsData);
          
          // Load posted jobs if employer
          if (data.userType === 'employer') {
            const postedJobsQuery = query(
              collection(db, 'jobs'),
              where('employerId', '==', user.uid)
            );
            const postedJobsSnapshot = await getDocs(postedJobsQuery);
            const postedJobsData = [];
            
            postedJobsSnapshot.forEach((jobDoc) => {
              postedJobsData.push({ id: jobDoc.id, ...jobDoc.data() });
            });
            
            setPostedJobs(postedJobsData);
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // Implementation for saving profile changes
  };

  if (loading) {
    return (
      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>My Profile - ManuaLink</title>
        <meta name="description" content="Manage your ManuaLink profile, saved jobs, and applications." />
      </Head>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-gray-600">{userData.userType === 'worker' ? '👷 Worker' : '💼 Employer'}</p>
                  <p className="text-gray-600">{userData.email || userData.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button
                  className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`px-6 py-3 font-medium ${activeTab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('saved')}
                >
                  Saved Jobs ({savedJobs.length})
                </button>
                <button
                  className={`px-6 py-3 font-medium ${activeTab === 'applications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('applications')}
                >
                  Applications ({appliedJobs.length})
                </button>
                {userData.userType === 'employer' && (
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === 'posted' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('posted')}
                  >
                    Posted Jobs ({postedJobs.length})
                  </button>
                )}
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <form onSubmit={handleSaveProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            defaultValue={userData.name}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            defaultValue={userData.email || ''}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            defaultValue={userData.phone}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="location">Location</label>
                          <input
                            type="text"
                            id="location"
                            defaultValue={userData.profile?.location || ''}
                            className="form-input"
                          />
                        </div>
                      </div>
                      
                      {userData.userType === 'worker' && (
                        <>
                          <div className="form-group mb-4">
                            <label htmlFor="skills">Skills (comma separated)</label>
                            <input
                              type="text"
                              id="skills"
                              defaultValue={userData.profile?.skills?.join(', ') || ''}
                              className="form-input"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="form-group">
                              <label htmlFor="experience">Experience Level</label>
                              <select
                                id="experience"
                                defaultValue={userData.profile?.experience || 'Beginner'}
                                className="form-input"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="availability">Availability</label>
                              <select
                                id="availability"
                                defaultValue={userData.profile?.availability || 'Full-time'}
                                className="form-input"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="On-call">On-call</option>
                              </select>
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="hourlyRate">Hourly Rate (KSH)</label>
                              <input
                                type="number"
                                id="hourlyRate"
                                defaultValue={userData.profile?.hourlyRate || ''}
                                className="form-input"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="form-group mb-4">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                          id="bio"
                          rows="4"
                          defaultValue={userData.bio || ''}
                          className="form-input"
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'saved' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Saved Jobs</h3>
                    {savedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {savedJobs.map(job => (
                          <div key={job.id} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-gray-600">{job.location} • KSH {job.pay}/{job.payPeriod}</p>
                            <div className="flex gap-2 mt-2">
                              <button className="btn btn-primary btn-small">View Job</button>
                              <button className="btn btn-danger btn-small">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">You haven't saved any jobs yet.</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'applications' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Job Applications</h3>
                    {appliedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {appliedJobs.map(app => (
                          <div key={app.applicationId} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{app.job.title}</h4>
                            <p className="text-gray-600">{app.job.location}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status}
                              </span>
                              <span className="text-sm text-gray-600">
                                Applied on {app.createdAt?.toDate().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">You haven't applied to any jobs yet.</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'posted' && userData.userType === 'employer' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Jobs You've Posted</h3>
                    {postedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {postedJobs.map(job => (
                          <div key={job.id} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-gray-600">{job.location} • KSH {job.pay}/{job.payPeriod}</p>
                            <p className="text-sm text-gray-600">
                              Posted on {job.createdAt?.toDate().toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button className="btn btn-primary btn-small">View Details</button>
                              <button className="btn btn-secondary btn-small">Edit</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">You haven't posted any jobs yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <button className="btn btn-secondary">Update Password</button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Notification Preferences</h4>
                  <button className="btn btn-secondary">Manage Notifications</button>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                <button className="btn btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}