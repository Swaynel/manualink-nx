import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <Head>
        <title>About Us - ManuaLink</title>
        <meta
          name="description"
          content="Learn about ManuaLink's mission to connect Kenyan workers with employment opportunities."
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">

          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About ManuaLink</h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              {'Connecting skilled Kenyan workers with employers who need them. Our mission is to create opportunities and support Kenya\'s workforce.'}
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <i className="fas fa-bullseye text-blue-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-gray-600">
                {'To bridge the gap between skilled manual workers and employers in Kenya, creating economic opportunities and making it easier to find reliable work or workers.'}
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <i className="fas fa-eye text-blue-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
              <p className="text-gray-600">
                {'To become Kenya\'s leading platform for manual work connections, empowering thousands of workers and transforming how businesses find skilled labor.'}
              </p>
            </motion.div>
          </div>

          {/* Our Story */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                {'ManuaLink was founded in 2023 in response to the growing need for a reliable platform connecting skilled manual workers with employers across Kenya.'}
              </p>
              <p>
                {'Our founders witnessed firsthand the challenges faced by both workers seeking consistent employment and employers struggling to find qualified, reliable help for construction, farming, cleaning, and other manual work.'}
              </p>
              <p>
                {'Today, we\'re proud to have built a platform that serves thousands of Kenyans, helping them find work opportunities and build better lives for themselves and their families.'}
              </p>
            </div>
          </motion.div>

          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* CEO */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden relative">
                  <Image
                    src="/team/sayan.jpg"
                    alt="Sayan Nyariki"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">Sayan Nyariki</h3>
                <p className="text-blue-600 text-sm mb-2">Founder &amp; CEO</p>
                <p className="text-gray-600 text-sm">
                  {'Experienced entrepreneur with a passion for economic empowerment.'}
                </p>
              </motion.div>

              {/* Other team members */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden relative">
                  <Image
                    src="/team/sarah.jpg"
                    alt="Sarah Achieng"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">Sarah Achieng</h3>
                <p className="text-blue-600 text-sm mb-2">Head of Operations</p>
                <p className="text-gray-600 text-sm">
                  {'Dedicated to creating seamless experiences for our users.'}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden relative">
                  <Image
                    src="/team/david.jpg"
                    alt="David Ochieng"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">David Ochieng</h3>
                <p className="text-blue-600 text-sm mb-2">Technical Lead</p>
                <p className="text-gray-600 text-sm">
                  {'Ensuring our platform remains reliable and easy to use.'}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden relative">
                  <Image
                    src="/team/grace.jpg"
                    alt="Grace Wambui"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">Grace Wambui</h3>
                <p className="text-blue-600 text-sm mb-2">Community Manager</p>
                <p className="text-gray-600 text-sm">
                  {'Building and nurturing our community of workers and employers.'}
                </p>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
