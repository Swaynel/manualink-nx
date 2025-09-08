import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Modals() {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userType = formData.get('userType');
    const name = formData.get('registerName');
    const phone = formData.get('registerPhone');
    const email = formData.get('registerEmail');
    const password = formData.get('registerPassword');
    const confirmPassword = formData.get('registerConfirmPassword');

    if (password !== confirmPassword) {
      alert('Passwords do not match');
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
        createdAt: new Date()
      };

      if (userType === 'worker') {
        userData.profile = {
          skills: [],
          experience: 'Beginner',
          availability: 'Full-time',
          certifications: [],
          rating: null,
          location: null,
          hourlyRate: null
        };
      }

      await setDoc(doc(db, 'users', user.uid), userData);
      closeModal();
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('loginEmail');
    const password = formData.get('loginPassword');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div
        className={`modal ${activeModal === 'login' ? 'active' : ''}`}
        id="loginModal"
        aria-hidden="true"
        role="dialog"
      >
        <div className="modal-content">
          <span
            className="close-modal"
            onClick={closeModal}
            aria-label="Close login modal"
          >
            ×
          </span>
          <h2>Login to Your Account</h2>
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginEmail">Phone Number or Email</label>
              <input
                type="text"
                id="loginEmail"
                name="loginEmail"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                name="loginPassword"
                required
                aria-required="true"
              />
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" aria-label="Remember me" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <div className="form-footer">
              <p>
                Don&apos;t have an account?{' '}
                <a
                  href="#"
                  onClick={() => setActiveModal('register')}
                  className="switch-to-register"
                >
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Registration Modal */}
      <div
        className={`modal ${activeModal === 'register' ? 'active' : ''}`}
        id="registerModal"
        aria-hidden="true"
        role="dialog"
      >
        <div className="modal-content">
          <span
            className="close-modal"
            onClick={closeModal}
            aria-label="Close register modal"
          >
            ×
          </span>
          <h2>Create an Account</h2>
          <form id="registerForm" onSubmit={handleRegister}>
            <div className="form-group">
              <label>I am a:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="worker"
                    defaultChecked
                    aria-label="Register as worker"
                  />{' '}
                  Worker
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="employer"
                    aria-label="Register as employer"
                  />{' '}
                  Employer
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="registerName">Full Name</label>
              <input
                type="text"
                id="registerName"
                name="registerName"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerPhone">
                Phone Number (e.g., +254123456789)
              </label>
              <input
                type="tel"
                id="registerPhone"
                name="registerPhone"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerEmail">Email (Optional)</label>
              <input type="email" id="registerEmail" name="registerEmail" />
            </div>
            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>
              <input
                type="password"
                id="registerPassword"
                name="registerPassword"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerConfirmPassword">Confirm Password</label>
              <input
                type="password"
                id="registerConfirmPassword"
                name="registerConfirmPassword"
                required
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  required
                  aria-label="Agree to terms and privacy policy"
                />{' '}
                I agree to the <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <div className="form-footer">
              <p>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={() => setActiveModal('login')}
                  className="switch-to-login"
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Other modals can be added similarly */}
    </>
  );
}
