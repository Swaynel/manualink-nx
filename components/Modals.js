import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Modals({ activeModal, setActiveModal }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('worker');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const closeModal = () => {
    setActiveModal(null);
    setErrors({});
    setPasswordStrength(0);
  };

  // Validate phone number format
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phone);
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(checkPasswordStrength(password));
  };

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
      setErrors({ general: 'Error redirecting to dashboard. Please try logging in again.' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.target);
    const userType = formData.get('userType');
    const name = formData.get('registerName');
    const phone = formData.get('registerPhone');
    const email = formData.get('registerEmail');
    const password = formData.get('registerPassword');
    const confirmPassword = formData.get('registerConfirmPassword');

    // Validation
    const newErrors = {};
    
    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        const experience = formData.get('experience') || 'Beginner';
        const availability = formData.get('availability') || 'Full-time';
        const hourlyRate = formData.get('hourlyRate') || null;
        const location = formData.get('location') || null;
        
        userData.profile = {
          skills: [],
          experience,
          availability,
          certifications: [],
          rating: null,
          location,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        };
      } else if (userType === 'employer') {
        const companyName = formData.get('companyName') || '';
        const companySize = formData.get('companySize') || '';
        const industry = formData.get('industry') || '';
        
        userData.profile = {
          companyName,
          companySize,
          industry,
          rating: null,
          location: null,
        };
      }

      await setDoc(doc(db, 'users', user.uid), userData);
      closeModal();
      redirectUser(user.uid);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ general: 'This email is already registered. Please try logging in.' });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.target);
    const email = formData.get('loginEmail');
    const password = formData.get('loginPassword');
    const rememberMe = formData.get('rememberMe');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      closeModal();
      redirectUser(userCredential.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setErrors({ general: 'No account found with these credentials.' });
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ general: 'Incorrect password. Please try again.' });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator component
  const PasswordStrength = ({ strength }) => {
    const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    return (
      <div className="mt-1">
        <div className="flex h-1 overflow-hidden bg-gray-200 rounded">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 ${i <= strength ? (
                strength === 1 ? 'bg-red-500' :
                strength === 2 ? 'bg-orange-500' :
                strength === 3 ? 'bg-yellow-500' : 'bg-green-500'
              ) : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className={`text-xs mt-1 ${
          strength === 0 ? 'text-gray-500' :
          strength === 1 ? 'text-red-500' :
          strength === 2 ? 'text-orange-500' :
          strength === 3 ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {strength > 0 ? strengthLabels[strength - 1] : 'Enter a password'}
        </p>
      </div>
    );
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
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
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
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                name="loginEmail"
                placeholder="Phone or Email"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="loginPassword"
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" name="rememberMe" className="rounded" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex justify-center items-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
            
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-2 px-4 flex justify-center items-center bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700 w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
              >
                <svg width="20" height="20" className="mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="py-2 px-4 flex justify-center items-center bg-blue-800 hover:bg-blue-900 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
              >
                <svg width="20" height="20" className="mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
            
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
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="userType" 
                  value="worker" 
                  defaultChecked 
                  onChange={(e) => setUserType(e.target.value)}
                /> 
                Worker
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="userType" 
                  value="employer" 
                  onChange={(e) => setUserType(e.target.value)}
                /> 
                Employer
              </label>
            </div>
            
            <div>
              <input
                type="text"
                name="registerName"
                placeholder={userType === 'worker' ? "Full Name" : "Your Name"}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Employer-specific fields */}
            {userType === 'employer' && (
              <div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div>
              <input
                type="tel"
                name="registerPhone"
                placeholder="Phone Number (e.g., +254711929567)"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            <div>
              <input
                type="email"
                name="registerEmail"
                placeholder="Email (Optional)"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Worker-specific fields */}
            {userType === 'worker' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                      name="experience"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <select
                      name="availability"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                    <input
                      type="number"
                      name="hourlyRate"
                      placeholder="e.g., 15.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Employer-specific fields */}
            {userType === 'employer' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <select
                    name="companySize"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    name="industry"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Construction">Construction</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}
            
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="registerPassword"
                  placeholder="Password"
                  required
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrength strength={passwordStrength} />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            
            <div>
              <input
                type="password"
                name="registerConfirmPassword"
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            <label className="flex items-start space-x-2 text-sm">
              <input type="checkbox" required className="mt-1 rounded" /> 
              <span>I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            
            <button
              type="submit"
              className={`w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex justify-center items-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : 'Register'}
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