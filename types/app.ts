export const JOB_CATEGORIES = [
  "Construction",
  "Farming",
  "Cleaning",
  "Transport",
  "Gardening",
] as const;

export const WORKER_EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Expert",
] as const;

export const WORKER_LOCATIONS = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
export type JobFilter = "all" | JobCategory;
export type JobSort = "newest" | "oldest" | "pay-high" | "pay-low";
export type WorkerSort = "rating" | "experience";
export type WorkerExperienceFilter = "all" | (typeof WORKER_EXPERIENCE_LEVELS)[number];
export type WorkerLocationFilter = "all" | (typeof WORKER_LOCATIONS)[number];
export type ModalType = "login" | "register";
export type UserType = "worker" | "employer";

export interface FirestoreTimestampLike {
  toDate: () => Date;
}

export interface JobDocument {
  id: string;
  employerId?: string;
  title?: string;
  location?: string;
  pay?: number;
  payPeriod?: string;
  createdAt?: FirestoreTimestampLike | Date | string | null;
  datePosted?: string | Date | null;
  jobCategory?: string;
  requirements?: string[];
  status?: string;
  description?: string;
  assignedWorkerId?: string;
  applicants?: string[];
}

export interface WorkerProfile {
  skills?: string[];
  experience?: string;
  availability?: string;
  certifications?: string[];
  rating?: number | null;
  location?: string | null;
  hourlyRate?: number | null;
}

export interface EmployerProfile {
  companyName?: string;
  companySize?: string;
  industry?: string;
  rating?: number | null;
  location?: string | null;
}

export interface AppUserDocument {
  userType?: UserType;
  name?: string;
  phone?: string | null;
  email?: string | null;
  bio?: string;
  skills?: string[];
  savedJobs?: string[];
  alertSubscriptions?: string[];
  profile?: WorkerProfile | EmployerProfile;
  createdAt?: Date | FirestoreTimestampLike | string | null;
}

export interface WorkerDocument {
  id: string;
  userType?: string;
  name?: string;
  profile?: WorkerProfile;
}

export interface ApplicationDocument {
  id: string;
  workerId?: string;
  workerName?: string;
  jobId?: string;
  jobTitle?: string;
  experience?: string;
  appliedDate?: string | Date | null;
  status?: string;
  notes?: string;
}
