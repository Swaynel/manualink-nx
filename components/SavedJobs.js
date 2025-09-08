import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function SavedJobs() {
  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSavedJobs(userData.savedJobs || []);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return null; // Don't show saved jobs section if user is not logged in
  }

  return (
    <section className="saved-jobs" aria-labelledby="saved-jobs-heading">
      <div className="container">
        <h2 id="saved-jobs-heading">Saved Jobs ({savedJobs.length})</h2>
        <div className="saved-jobs-list" aria-live="polite">
          {savedJobs.length > 0 ? (
            savedJobs.map(jobId => (
              <div key={jobId} className="saved-job-card">
                <h4>Job #{jobId}</h4>
                <p>Details about the saved job would appear here</p>
                <button className="btn btn-small view-job" data-id={jobId}>View</button>
                <button className="btn btn-small remove-job" data-id={jobId}>Remove</button>
              </div>
            ))
          ) : (
            <div className="no-saved-jobs">
              <i className="fas fa-exclamation-circle"></i>
              <p>You have no saved jobs</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}