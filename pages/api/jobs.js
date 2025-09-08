import { collection, getDocs, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { category, sort, page = 1, limit = 10 } = req.query;
      
      let jobsQuery = collection(db, 'jobs');
      
      if (category && category !== 'all') {
        jobsQuery = query(jobsQuery, where('jobCategory', '==', category));
      }
      
      // Apply sorting
      if (sort === 'newest') {
        jobsQuery = query(jobsQuery, orderBy('createdAt', 'desc'));
      } else if (sort === 'oldest') {
        jobsQuery = query(jobsQuery, orderBy('createdAt', 'asc'));
      } else if (sort === 'pay-high') {
        jobsQuery = query(jobsQuery, orderBy('pay', 'desc'));
      } else if (sort === 'pay-low') {
        jobsQuery = query(jobsQuery, orderBy('pay', 'asc'));
      } else {
        jobsQuery = query(jobsQuery, orderBy('createdAt', 'desc'));
      }
      
      const querySnapshot = await getDocs(jobsQuery);
      const jobs = [];
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      
      // Simple pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = jobs.slice(startIndex, endIndex);
      
      res.status(200).json({
        jobs: paginatedJobs,
        total: jobs.length,
        page: parseInt(page),
        totalPages: Math.ceil(jobs.length / limit)
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const jobData = req.body;
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        createdAt: new Date()
      });
      
      res.status(201).json({ id: docRef.id, ...jobData });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}