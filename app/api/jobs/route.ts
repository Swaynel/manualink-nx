import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../lib/firebase";
import type { JobDocument, JobSort } from "../../../types/app";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsedValue = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = (searchParams.get("sort") as JobSort | null) ?? "newest";
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = parsePositiveInt(searchParams.get("limit"), 10);

    let jobsQuery = query(collection(db, "jobs"));

    if (category && category !== "all") {
      jobsQuery = query(jobsQuery, where("jobCategory", "==", category));
    }

    switch (sort) {
      case "oldest":
        jobsQuery = query(jobsQuery, orderBy("createdAt", "asc"));
        break;
      case "pay-high":
        jobsQuery = query(jobsQuery, orderBy("pay", "desc"));
        break;
      case "pay-low":
        jobsQuery = query(jobsQuery, orderBy("pay", "asc"));
        break;
      case "newest":
      default:
        jobsQuery = query(jobsQuery, orderBy("createdAt", "desc"));
        break;
    }

    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map((documentSnapshot) => ({
      id: documentSnapshot.id,
      ...(documentSnapshot.data() as Omit<JobDocument, "id">),
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    return NextResponse.json({
      jobs: paginatedJobs,
      total: jobs.length,
      page,
      totalPages: Math.ceil(jobs.length / limit),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = (await request.json()) as Omit<JobDocument, "id" | "createdAt">;
    const docRef = await addDoc(collection(db, "jobs"), {
      ...jobData,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, ...jobData }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
