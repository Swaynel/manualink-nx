"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  JOB_CATEGORIES,
  type FirestoreTimestampLike,
  type JobDocument,
  type JobFilter,
  type JobSort,
} from "../types/app";

interface FeaturedJobsProps {
  limit?: number;
}

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
  const date = getDateValue(timestamp);

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

export default function FeaturedJobs({ limit = 5 }: FeaturedJobsProps) {
  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [currentFilter, setCurrentFilter] = useState<JobFilter>("all");
  const [currentSort, setCurrentSort] = useState<JobSort>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = limit;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"));
        let jobsData = snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...(documentSnapshot.data() as Omit<JobDocument, "id">),
        }));

        if (currentFilter !== "all") {
          jobsData = jobsData.filter((job) => job.jobCategory === currentFilter);
        }

        jobsData.sort((leftJob, rightJob) => {
          const leftDate = getDateValue(leftJob.createdAt)?.getTime() ?? 0;
          const rightDate = getDateValue(rightJob.createdAt)?.getTime() ?? 0;
          const leftPay = leftJob.pay ?? 0;
          const rightPay = rightJob.pay ?? 0;

          switch (currentSort) {
            case "pay-high":
              return rightPay - leftPay;
            case "pay-low":
              return leftPay - rightPay;
            case "oldest":
              return leftDate - rightDate;
            case "newest":
            default:
              return rightDate - leftDate;
          }
        });

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    setCurrentPage(1);
    void fetchJobs();
  }, [currentFilter, currentSort]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <section className="bg-gray-50 py-16" id="jobs" aria-labelledby="jobs-heading">
      <div className="container mx-auto px-4">
        <h2
          id="jobs-heading"
          className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl"
        >
          Featured Jobs in Kenya
        </h2>

        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap gap-2" role="tablist">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                role="tab"
                aria-selected={currentFilter === filter}
                onClick={() => setCurrentFilter(filter)}
              >
                {filter === "all" ? "All" : filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="featuredJobsSort" className="font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="featuredJobsSort"
              aria-label="Sort featured job listings"
              value={currentSort}
              onChange={(event) => setCurrentSort(event.target.value as JobSort)}
              className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="pay-high">Highest Pay</option>
              <option value="pay-low">Lowest Pay</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {job.title ?? "Untitled job"}
                </h3>
                <p className="flex items-center gap-2 text-gray-500">
                  <i className="fas fa-map-marker-alt" />{" "}
                  {job.location ?? "Location not specified"}
                </p>
                <p className="flex items-center gap-2 text-gray-500">
                  <i className="fas fa-money-bill-wave" /> KSH {job.pay ?? 0}/
                  {job.payPeriod ?? "job"}
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <i className="fas fa-clock" /> {formatDate(job.createdAt)}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
                    {job.jobCategory ?? "General"}
                  </span>
                  {job.requirements?.slice(0, 2).map((requirement) => (
                    <span
                      key={requirement}
                      className="rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-800"
                    >
                      {requirement}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="flex-1 rounded-lg bg-gray-200 py-2 font-medium text-gray-800 transition hover:bg-gray-300">
                    Save Job
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              <i className="fas fa-search mb-2 text-3xl" />
              <p>No jobs found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex gap-2">
              <button
                className={`rounded-md px-4 py-2 font-medium transition ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <i className="fas fa-chevron-left mr-1" /> Previous
              </button>
              <button
                className={`rounded-md px-4 py-2 font-medium transition ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next <i className="fas fa-chevron-right ml-1" />
              </button>
            </div>
            <span className="font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-block rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition hover:bg-gray-900"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
