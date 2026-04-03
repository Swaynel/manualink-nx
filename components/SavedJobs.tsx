"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { AppUserDocument } from "../types/app";

export default function SavedJobs() {
  const [user, setUser] = useState<User | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setSavedJobs([]);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", nextUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as AppUserDocument;
        setSavedJobs(userData.savedJobs ?? []);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <section className="saved-jobs" aria-labelledby="saved-jobs-heading">
      <div className="container">
        <h2 id="saved-jobs-heading">Saved Jobs ({savedJobs.length})</h2>
        <div className="saved-jobs-list" aria-live="polite">
          {savedJobs.length > 0 ? (
            savedJobs.map((jobId) => (
              <div key={jobId} className="saved-job-card">
                <h4>Job #{jobId}</h4>
                <p>Details about the saved job would appear here</p>
                <button className="btn btn-small view-job" data-id={jobId}>
                  View
                </button>
                <button className="btn btn-small remove-job" data-id={jobId}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="no-saved-jobs">
              <i className="fas fa-exclamation-circle" />
              <p>You have no saved jobs</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
