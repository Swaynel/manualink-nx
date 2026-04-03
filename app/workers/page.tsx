"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  JOB_CATEGORIES,
  WORKER_EXPERIENCE_LEVELS,
  WORKER_LOCATIONS,
  type WorkerDocument,
  type WorkerExperienceFilter,
  type WorkerLocationFilter,
  type WorkerSort,
} from "../../types/app";

interface WorkersFilters {
  skill: "all" | (typeof JOB_CATEGORIES)[number];
  experience: WorkerExperienceFilter;
  location: WorkerLocationFilter;
  sort: WorkerSort;
}

interface FeedbackState {
  type: "success" | "error";
  message: string;
}

const WORKERS_PER_PAGE = 6;

export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WorkersFilters>({
    skill: "all",
    experience: "all",
    location: "all",
    sort: "rating",
  });
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchWorkers = async (
      loadMore: boolean,
      cursor: QueryDocumentSnapshot<DocumentData> | null,
    ) => {
      try {
        if (!loadMore) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const constraints: QueryConstraint[] = [where("userType", "==", "worker")];

        if (filters.sort === "rating") {
          constraints.push(orderBy("profile.rating", "desc"));
        } else {
          constraints.push(orderBy("profile.experience", "desc"));
        }

        if (loadMore && cursor) {
          constraints.push(startAfter(cursor));
        }

        constraints.push(limit(WORKERS_PER_PAGE));

        const workersQuery = query(collection(db, "users"), ...constraints);
        const snapshot = await getDocs(workersQuery);

        const workersData = snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...(documentSnapshot.data() as Omit<WorkerDocument, "id">),
        }));

        let filteredWorkers = workersData;

        if (filters.skill !== "all") {
          filteredWorkers = filteredWorkers.filter((worker) =>
            worker.profile?.skills?.includes(filters.skill),
          );
        }

        if (filters.experience !== "all") {
          filteredWorkers = filteredWorkers.filter(
            (worker) => worker.profile?.experience === filters.experience,
          );
        }

        if (filters.location !== "all") {
          filteredWorkers = filteredWorkers.filter(
            (worker) => worker.profile?.location === filters.location,
          );
        }

        setLastDoc(snapshot.docs.at(-1) ?? cursor);

        if (loadMore) {
          setWorkers((currentWorkers) => [...currentWorkers, ...filteredWorkers]);
        } else {
          setWorkers(filteredWorkers);
        }
      } catch (error) {
        console.error("Failed to fetch workers:", error);
        setFeedback({ type: "error", message: "Failed to fetch workers." });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    setLastDoc(null);
    void fetchWorkers(false, null);
  }, [filters]);

  const handleFilterChange = <TKey extends keyof WorkersFilters>(
    type: TKey,
    value: WorkersFilters[TKey],
  ) => {
    setFilters((currentFilters) => ({ ...currentFilters, [type]: value }));
  };

  const renderRatingStars = (rating?: number | null) => {
    if (!rating) return "No ratings yet";

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center justify-center md:justify-start">
        {Array.from({ length: fullStars }).map((_, index) => (
          <i key={`full-${index}`} className="fas fa-star text-yellow-400" />
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt text-yellow-400" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <i key={`empty-${index}`} className="far fa-star text-yellow-400" />
        ))}
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const contactWorker = (workerName?: string) => {
    setFeedback({
      type: "success",
      message: `You contacted ${workerName ?? "this worker"}!`,
    });

    window.setTimeout(() => setFeedback(null), 3000);
  };

  const loadMoreWorkers = async () => {
    if (!lastDoc) {
      return;
    }

    try {
      setLoadingMore(true);

      const constraints: QueryConstraint[] = [where("userType", "==", "worker")];

      if (filters.sort === "rating") {
        constraints.push(orderBy("profile.rating", "desc"));
      } else {
        constraints.push(orderBy("profile.experience", "desc"));
      }

      constraints.push(startAfter(lastDoc));
      constraints.push(limit(WORKERS_PER_PAGE));

      const workersQuery = query(collection(db, "users"), ...constraints);
      const snapshot = await getDocs(workersQuery);

      const workersData = snapshot.docs.map((documentSnapshot) => ({
        id: documentSnapshot.id,
        ...(documentSnapshot.data() as Omit<WorkerDocument, "id">),
      }));

      let filteredWorkers = workersData;

      if (filters.skill !== "all") {
        filteredWorkers = filteredWorkers.filter((worker) =>
          worker.profile?.skills?.includes(filters.skill),
        );
      }

      if (filters.experience !== "all") {
        filteredWorkers = filteredWorkers.filter(
          (worker) => worker.profile?.experience === filters.experience,
        );
      }

      if (filters.location !== "all") {
        filteredWorkers = filteredWorkers.filter(
          (worker) => worker.profile?.location === filters.location,
        );
      }

      setLastDoc(snapshot.docs.at(-1) ?? lastDoc);
      setWorkers((currentWorkers) => [...currentWorkers, ...filteredWorkers]);
    } catch (error) {
      console.error("Failed to load more workers:", error);
      setFeedback({ type: "error", message: "Failed to load more workers." });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-2 text-center text-3xl font-bold">Find Skilled Workers</h1>
        <p className="mb-8 text-center text-gray-600">
          Connect with reliable manual workers across Kenya
        </p>

        <div className="mb-4 text-right md:hidden">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => setFiltersOpen((currentValue) => !currentValue)}
          >
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div
          className={`${filtersOpen ? "block" : "hidden"} mb-8 rounded-lg bg-white p-6 shadow-md md:block`}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Skill
              </label>
              <select
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filters.skill}
                onChange={(event) =>
                  handleFilterChange(
                    "skill",
                    event.target.value as WorkersFilters["skill"],
                  )
                }
              >
                <option value="all">All Skills</option>
                {JOB_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Experience
              </label>
              <select
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filters.experience}
                onChange={(event) =>
                  handleFilterChange(
                    "experience",
                    event.target.value as WorkerExperienceFilter,
                  )
                }
              >
                <option value="all">All Experience</option>
                {WORKER_EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filters.location}
                onChange={(event) =>
                  handleFilterChange(
                    "location",
                    event.target.value as WorkerLocationFilter,
                  )
                }
              >
                <option value="all">All Locations</option>
                {WORKER_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filters.sort}
                onChange={(event) =>
                  handleFilterChange("sort", event.target.value as WorkerSort)
                }
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>
        </div>

        {feedback && (
          <div
            className={`mb-4 rounded p-4 ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: WORKERS_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg bg-white p-6 shadow-md"
              >
                <div className="mb-4 h-6 rounded bg-gray-300" />
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-300" />
                <div className="mb-2 h-4 w-1/2 rounded bg-gray-300" />
                <div className="mt-4 h-8 rounded bg-gray-300" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {workers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {workers.map((worker) => (
                  <div key={worker.id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 text-center">
                      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
                        <i className="fas fa-user text-3xl text-gray-500" />
                      </div>
                      <h2 className="text-xl font-semibold">
                        {worker.name ?? "Unnamed worker"}
                      </h2>
                      <p className="text-gray-600">
                        {worker.profile?.location ?? "Location not specified"}
                      </p>
                    </div>

                    <div className="mb-4">{renderRatingStars(worker.profile?.rating)}</div>

                    <div className="mb-4">
                      <h3 className="mb-1 font-medium">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {worker.profile?.skills?.length ? (
                          worker.profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-blue-100 px-2.5 py-0.5 text-xs text-blue-800"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No skills listed</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="mb-1 font-medium">Experience</h3>
                      <p className="text-gray-600">
                        {worker.profile?.experience ?? "Not specified"}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h3 className="mb-1 font-medium">Availability</h3>
                      <p className="text-gray-600">
                        {worker.profile?.availability ?? "Not specified"}
                      </p>
                    </div>

                    {worker.profile?.hourlyRate && (
                      <div className="mb-4">
                        <h3 className="mb-1 font-medium">Hourly Rate</h3>
                        <p className="text-gray-600">
                          KSH {worker.profile.hourlyRate}/hr
                        </p>
                      </div>
                    )}

                    <button
                      className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                      onClick={() => contactWorker(worker.name)}
                    >
                      Contact Worker
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full py-12 text-center">
                <i className="fas fa-search mb-4 text-4xl text-gray-400" />
                <p className="text-gray-600">
                  No workers found matching your criteria
                </p>
              </div>
            )}

            {lastDoc && !loadingMore && (
              <div className="mt-6 text-center">
                <button
                  className="rounded bg-gray-200 px-6 py-2 transition hover:bg-gray-300"
                  onClick={() => {
                    void loadMoreWorkers();
                  }}
                >
                  Load More
                </button>
              </div>
            )}

            {loadingMore && (
              <div className="mt-6 text-center text-gray-500">
                Loading more workers...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
