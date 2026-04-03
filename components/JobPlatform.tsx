"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

interface CategoryCard {
  name: string;
  icon: string;
  count: number;
}

const categorySeed = [
  { name: "Construction", icon: "fa-hammer" },
  { name: "Farming", icon: "fa-tractor" },
  { name: "Cleaning", icon: "fa-broom" },
  { name: "Transport", icon: "fa-truck-moving" },
  { name: "Gardening", icon: "fa-leaf" },
] as const;

export default function JobPlatform() {
  const [categories, setCategories] = useState<CategoryCard[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesWithCount = await Promise.all(
        categorySeed.map(async (category) => {
          const jobsQuery = query(
            collection(db, "jobs"),
            where("jobCategory", "==", category.name),
          );
          const querySnapshot = await getDocs(jobsQuery);

          return { ...category, count: querySnapshot.size };
        }),
      );

      setCategories(categoriesWithCount);
    };

    void fetchCategories();
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">
          Popular Job Categories in Kenya
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <i className={`fas ${category.icon} mb-4 text-4xl text-blue-600`} />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {category.name}
              </h3>
              <p className="mb-6 text-gray-500">{category.count} jobs available</p>
              <Link
                href="/jobs"
                className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Browse Jobs
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
