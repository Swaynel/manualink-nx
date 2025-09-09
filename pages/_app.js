import { useState, useEffect } from 'react';
import Head from 'next/head';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Layout from '../components/Layout';
import Modals from '../components/Modals';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // modal state lifted

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Head>
        {/* PWA essentials */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E40AF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <Layout currentUser={currentUser} setActiveModal={setActiveModal}>
        {/* Modals shared across the app */}
        <Modals activeModal={activeModal} setActiveModal={setActiveModal} />
        <Component {...pageProps} currentUser={currentUser} />
      </Layout>
    </>
  );
}

export default MyApp;
