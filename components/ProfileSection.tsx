"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { AppUserDocument, WorkerProfile } from "../types/app";

export default function ProfileSection() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUserDocument | null>(null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setUserData(null);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", nextUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as AppUserDocument);
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

  const workerProfile =
    userData?.userType === "worker"
      ? (userData.profile as WorkerProfile | undefined)
      : undefined;

  return (
    <section className="profile-section" id="profile" aria-labelledby="profile-heading">
      <div className="container">
        <h2 id="profile-heading">Your Profile</h2>
        <div className="profile-content" aria-live="polite">
          {userData ? (
            <>
              <div className="profile-header">
                <h2>{userData.name ?? "Unnamed user"}</h2>
                <p>{userData.userType === "worker" ? "Worker" : "Employer"}</p>
                <button className="btn btn-primary edit-profile">Edit Profile</button>
                {userData.userType === "employer" && (
                  <button className="btn btn-primary post-job">Post New Job</button>
                )}
              </div>

              {workerProfile && (
                <div className="profile-section">
                  <h3>Worker Profile</h3>
                  <p>
                    <strong>Skills:</strong> {workerProfile.skills?.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Experience:</strong> {workerProfile.experience || "Not specified"}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {workerProfile.availability || "Not specified"}
                  </p>
                  {workerProfile.hourlyRate && (
                    <p>
                      <strong>Hourly Rate:</strong> KSH {workerProfile.hourlyRate}
                    </p>
                  )}
                  {workerProfile.location && (
                    <p>
                      <strong>Location:</strong> {workerProfile.location}
                    </p>
                  )}
                  {workerProfile.rating && (
                    <p>
                      <strong>Rating:</strong> {workerProfile.rating.toFixed(1)}
                    </p>
                  )}
                </div>
              )}

              <div className="profile-section">
                <h3>Job Alert Subscriptions</h3>
                {userData.alertSubscriptions?.length ? (
                  <ul>
                    {userData.alertSubscriptions.map((category) => (
                      <li key={category}>
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
