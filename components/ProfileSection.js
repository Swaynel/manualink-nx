import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function ProfileSection() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <section className="profile-section" id="profile" aria-labelledby="profile-heading">
        <div className="container">
          <h2 id="profile-heading">Your Profile</h2>
          <div className="profile-content" aria-live="polite">
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-section" id="profile" aria-labelledby="profile-heading">
      <div className="container">
        <h2 id="profile-heading">Your Profile</h2>
        <div className="profile-content" aria-live="polite">
          {userData ? (
            <>
              <div className="profile-header">
                <h2>{userData.name}</h2>
                <p>{userData.userType === 'worker' ? '👷 Worker' : '💼 Employer'}</p>
                <button className="btn btn-primary edit-profile">Edit Profile</button>
                {userData.userType === 'employer' && (
                  <button className="btn btn-primary post-job">Post New Job</button>
                )}
              </div>
              
              {userData.userType === 'worker' && userData.profile && (
                <div className="profile-section">
                  <h3>Worker Profile</h3>
                  <p><strong>Skills:</strong> {userData.profile.skills?.join(', ') || 'None'}</p>
                  <p><strong>Experience:</strong> {userData.profile.experience || 'Not specified'}</p>
                  <p><strong>Availability:</strong> {userData.profile.availability || 'Not specified'}</p>
                  {userData.profile.hourlyRate && (
                    <p><strong>Hourly Rate:</strong> KSH {userData.profile.hourlyRate}</p>
                  )}
                  {userData.profile.location && (
                    <p><strong>Location:</strong> {userData.profile.location}</p>
                  )}
                  {userData.profile.rating && (
                    <p><strong>Rating:</strong> {'★'.repeat(Math.round(userData.profile.rating))} ({userData.profile.rating.toFixed(1)})</p>
                  )}
                </div>
              )}
              
              <div className="profile-section">
                <h3>Job Alert Subscriptions</h3>
                {userData.alertSubscriptions?.length > 0 ? (
                  <ul>
                    {userData.alertSubscriptions.map((category, index) => (
                      <li key={index}>
                        {category} 
                        <button className="btn btn-small unsubscribe" data-category={category}>
                          Unsubscribe
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No job alert subscriptions</p>
                )}
              </div>
            </>
          ) : (
            <p>Loading profile data...</p>
          )}
        </div>
      </div>
    </section>
  );
}