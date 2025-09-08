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
        { name: 'Gardening', icon: 'fa-leaf' }
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
    <section className="section-padding bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Job Categories in Kenya</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map(category => (
            <div key={category.name} className="platform-card">
              <i className={`fas ${category.icon} text-4xl text-blue-600 mb-4`}></i>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.count} jobs available</p>
              <button className="btn btn-primary w-full">Browse Jobs</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}