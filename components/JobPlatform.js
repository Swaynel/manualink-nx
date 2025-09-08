import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function JobPlatform() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = [
        { name: 'Construction', icon: 'fa-hammer' },
        { name: 'Farming', icon: 'fa-tractor' },
        { name: 'Cleaning', icon: 'fa-broom' },
        { name: 'Transport', icon: 'fa-truck-moving' },
        { name: 'Gardening', icon: 'fa-leaf' },
      ];

      const categoriesWithCount = await Promise.all(
        categoriesData.map(async (cat) => {
          const q = query(collection(db, 'jobs'), where('jobCategory', '==', cat.name));
          const querySnapshot = await getDocs(q);
          return { ...cat, count: querySnapshot.size };
        })
      );

      setCategories(categoriesWithCount);
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Popular Job Categories in Kenya
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
            >
              <i className={`fas ${category.icon} text-4xl text-blue-600 mb-4`}></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-gray-500 mb-6">{category.count} jobs available</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Browse Jobs
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
