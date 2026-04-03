"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  JOB_CATEGORIES,
  type FirestoreTimestampLike,
  type JobDocument,
  type JobFilter,
  type JobSort,
} from "../../types/app";

const jobsPerPage = 10;
const filters: JobFilter[] = ["all", ...JOB_CATEGORIES];

const getDateValue = (
  timestamp: FirestoreTimestampLike | Date | string | null | undefined,
) => {
  if (!timestamp) {
    return null;
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }

  if (typeof timestamp === "string") {
    const parsedDate = new Date(timestamp);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  return timestamp.toDate();
};

const formatDate = (timestamp: JobDocument["createdAt"]) => {
  const date = getDateValue(timestamp ?? null);

  if (!date) {
    return "Invalid Date";
  }

  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<JobFilter>("all");
  const [currentSort, setCurrentSort] = useState<JobSort>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const constraints: QueryConstraint[] = [];

        if (currentFilter !== "all") {
          constraints.push(where("jobCategory", "==", currentFilter));
        }

        switch (currentSort) {
          case "pay-high":
            constraints.push(orderBy("pay", "desc"));
            break;
          case "pay-low":
            constraints.push(orderBy("pay", "asc"));
            break;
          case "oldest":
            constraints.push(orderBy("createdAt", "asc"));
            break;
          case "newest":
          default:
            constraints.push(orderBy("createdAt", "desc"));
            break;
        }

        const jobsQuery = query(collection(db, "jobs"), ...constraints);
        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = querySnapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...(documentSnapshot.data() as Omit<JobDocument, "id">),
        }));

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    setCurrentPage(1);
    void fetchJobs();
  }, [currentFilter, currentSort]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  if (loading) {
    return (
      <div className="section-padding min-h-screen bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-center py-20">
            <div className="loading-spinner" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding min-h-screen bg-gray-50">
      <div className="container">
        <h1 className="mb-8 text-center text-3xl font-bold">All Job Listings</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="job-filters flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${currentFilter === filter ? "active" : ""}`}
                  onClick={() => {
                    setCurrentFilter(filter);
                    setCurrentPage(1);
                  }}
                >
                  {filter === "all" ? "All" : filter}
                </button>
              ))}
            </div>

            <div className="job-sort flex items-center gap-2">
              <label htmlFor="sortJobs" className="text-sm font-medium">
                Sort by:
              </label>
              <select
                id="sortJobs"
                className="rounded border border-gray-300 px-2 py-1 text-sm"
                value={currentSort}
                onChange={(event) => setCurrentSort(event.target.value as JobSort)}
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
              paginatedJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-blue-600">
                        {job.title ?? "Untitled job"}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>
                          <i className="fas fa-map-marker-alt mr-1" />{" "}
                          {job.location ?? "Location not specified"}
                        </span>
                        <span>
                          <i className="fas fa-money-bill-wave mr-1" /> KSH{" "}
                          {job.pay ?? 0}/{job.payPeriod ?? "job"}
                        </span>
                        <span>
                          <i className="fas fa-clock mr-1" /> {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <div className="job-tags">
                        <span className="job-type">{job.jobCategory ?? "General"}</span>
                        {job.requirements?.slice(0, 2).map((requirement) => (
                          <span key={requirement} className="job-req">
                            {requirement}
                          </span>
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
              <div className="py-12 text-center">
                <i className="fas fa-search mb-4 text-4xl text-gray-400" />
                <p className="text-gray-600">
                  No jobs found matching your criteria
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <i className="fas fa-chevron-left mr-1" /> Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next <i className="fas fa-chevron-right ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
