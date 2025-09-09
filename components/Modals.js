import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Modals({ activeModal, setActiveModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const closeModal = () => setActiveModal(null);

  // Redirect user to their dashboard
  const redirectUser = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) return;

      const { userType } = userDoc.data();
      if (userType === 'employer') router.push('/employer-dashboard');
      else router.push('/worker-dashboard');
    } catch (error) {
      console.error('Redirect error:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const userType = formData.get('userType');
    const name = formData.get('registerName');
    const phone = formData.get('registerPhone');
    const email = formData.get('registerEmail');
    const password = formData.get('registerPassword');
    const confirmPassword = formData.get('registerConfirmPassword');

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email || `${phone}@manualink.com`,
        password
      );
      const user = userCredential.user;

      const userData = {
        userType,
        name,
        phone,
        email: email || null,
        bio: '',
        skills: [],
        savedJobs: [],
        alertSubscriptions: [],
        createdAt: new Date(),
      };

      if (userType === 'worker') {
        userData.profile = {
          skills: [],
          experience: 'Beginner',
          availability: 'Full-time',
          certifications: [],
          rating: null,
          location: null,
          hourlyRate: null,
        };
      }

      await setDoc(doc(db, 'users', user.uid), userData);
      alert('Registration successful! Redirecting...');
      closeModal();
      redirectUser(user.uid);
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('loginEmail');
    const password = formData.get('loginPassword');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful! Redirecting...');
      closeModal();
      redirectUser(userCredential.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Modal wrapper
  const ModalWrapper = ({ children }) => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity ${
        activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={closeModal}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Login Modal */}
      {activeModal === 'login' && (
        <ModalWrapper>
          <h2 className="text-2xl font-semibold mb-4">Login to Your Account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              name="loginEmail"
              placeholder="Phone or Email"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="loginPassword"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className={`w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-sm text-center">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setActiveModal('register')}
              >
                Register
              </button>
            </p>
          </form>
        </ModalWrapper>
      )}

      {/* Register Modal */}
      {activeModal === 'register' && (
        <ModalWrapper>
          <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="userType" value="worker" defaultChecked /> Worker
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="userType" value="employer" /> Employer
              </label>
            </div>
            <input
              type="text"
              name="registerName"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="registerPhone"
              placeholder="Phone Number"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="registerEmail"
              placeholder="Email (Optional)"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="registerPassword"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="registerConfirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" required /> I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </label>
            <button
              type="submit"
              className={`w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="text-sm text-center">
              Already have an account?{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setActiveModal('login')}
              >
                Login
              </button>
            </p>
          </form>
        </ModalWrapper>
      )}
    </>
  );
}
