import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Modals from './Modals';
import NotificationContainer from './NotificationContainer';

export default function Layout({ children, currentUser }) {
  return (
    <>
      <Head>
        <meta name="description" content="ManuaLink connects skilled Kenyan workers with employers for manual jobs in construction, farming, cleaning, and more." />
        <meta name="keywords" content="jobs, manual work, Kenya, construction, farming, cleaning, employment" />
        <meta name="author" content="ManuaLink Team" />
      </Head>
      
      <Header currentUser={currentUser} />
      <main>{children}</main>
      <Footer />
      <Modals />
      <NotificationContainer />
    </>
  );
}