import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - ManuaLink</title>
        <meta
          name="description"
          content="Learn about ManuaLink&apos;s mission to connect Kenyan workers with employment opportunities."
        />
      </Head>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">About ManuaLink</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connecting skilled Kenyan workers with employers who need them. Our mission is to create opportunities and support Kenya&apos;s workforce.
            </p>
          </div>
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <i className="fas fa-bullseye text-blue-600 text-xl"></i>
              </div>
              <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
              <p className="text-gray-600">
                To bridge the gap between skilled manual workers and employers in Kenya, creating economic opportunities
                and making it easier to find reliable work or workers.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <i className="fas fa-eye text-blue-600 text-xl"></i>
              </div>
              <h2 className="text-xl font-semibold mb-3">Our Vision</h2>
              <p className="text-gray-600">
                To become Kenya&apos;s leading platform for manual work connections, empowering thousands of workers
                and transforming how businesses find skilled labor.
              </p>
            </div>
          </div>
          
          {/* Our Story */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                ManuaLink was founded in 2023 in response to the growing need for a reliable platform connecting skilled manual workers with employers across Kenya.
              </p>
              <p className="mb-4">
                Our founders witnessed firsthand the challenges faced by both workers seeking consistent employment and employers struggling to find qualified, reliable help for construction, farming, cleaning, and other manual work.
              </p>
              <p>
                Today, we&apos;re proud to have built a platform that serves thousands of Kenyans, helping them find work opportunities and build better lives for themselves and their families.
              </p>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-4xl text-gray-500"></i>
                </div>
                <h3 className="font-semibold mb-1">John Kamau</h3>
                <p className="text-blue-600 text-sm mb-2">Founder &amp; CEO</p>
                <p className="text-gray-600 text-sm">Experienced entrepreneur with a passion for economic empowerment.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-4xl text-gray-500"></i>
                </div>
                <h3 className="font-semibold mb-1">Sarah Achieng</h3>
                <p className="text-blue-600 text-sm mb-2">Head of Operations</p>
                <p className="text-gray-600 text-sm">Dedicated to creating seamless experiences for our users.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-4xl text-gray-500"></i>
                </div>
                <h3 className="font-semibold mb-1">David Ochieng</h3>
                <p className="text-blue-600 text-sm mb-2">Technical Lead</p>
                <p className="text-gray-600 text-sm">Ensuring our platform remains reliable and easy to use.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-user text-4xl text-gray-500"></i>
                </div>
                <h3 className="font-semibold mb-1">Grace Wambui</h3>
                <p className="text-blue-600 text-sm mb-2">Community Manager</p>
                <p className="text-gray-600 text-sm">Building and nurturing our community of workers and employers.</p>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-blue-600 text-white rounded-lg shadow-md p-8 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold mb-1">5,000+</p>
                <p className="text-sm">Active Workers</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">1,200+</p>
                <p className="text-sm">Registered Employers</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">8,500+</p>
                <p className="text-sm">Jobs Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">15+</p>
                <p className="text-sm">Counties Served</p>
              </div>
            </div>
          </div>
          
          {/* Values */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <i className="fas fa-handshake text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Trust</h3>
                <p className="text-gray-600">
                  We build trust through transparency, verification, and accountability in all our interactions.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <i className="fas fa-users text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We believe in the power of community and work to strengthen connections between workers and employers.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <i className="fas fa-rocket text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform to better serve the evolving needs of our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
