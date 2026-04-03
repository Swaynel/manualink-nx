"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { AppUserDocument, ModalType, UserType } from "../types/app";

interface ModalErrors {
  general?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

interface ModalsProps {
  activeModal: ModalType | null;
  setActiveModal: (modal: ModalType | null) => void;
}

const getStringFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const parseUserType = (value: string): UserType =>
  value === "employer" ? "employer" : "worker";

const normalizeLoginIdentifier = (value: string) =>
  value.includes("@") ? value : `${value}@manualink.com`;

function PasswordFieldToggle({
  showPassword,
  onToggle,
}: {
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
      onClick={onToggle}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      )}
    </button>
  );
}

function PasswordStrength({ strength }: { strength: number }) {
  const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

  return (
    <div className="mt-1">
      <div className="flex h-1 overflow-hidden rounded bg-gray-200">
        {[1, 2, 3, 4].map((value) => (
          <div
            key={value}
            className={`flex-1 ${
              value <= strength
                ? strength === 1
                  ? "bg-red-500"
                  : strength === 2
                    ? "bg-orange-500"
                    : strength === 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p
        className={`mt-1 text-xs ${
          strength === 0
            ? "text-gray-500"
            : strength === 1
              ? "text-red-500"
              : strength === 2
                ? "text-orange-500"
                : strength === 3
                  ? "text-yellow-500"
                  : "text-green-500"
        }`}
      >
        {strength > 0 ? strengthLabels[strength - 1] : "Enter a password"}
      </p>
    </div>
  );
}

function ModalWrapper({
  active,
  children,
  onClose,
}: {
  active: boolean;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${
        active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 text-xl font-bold text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function Modals({ activeModal, setActiveModal }: ModalsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("worker");
  const [errors, setErrors] = useState<ModalErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const closeModal = () => {
    setActiveModal(null);
    setErrors({});
    setPasswordStrength(0);
    setShowPassword(false);
  };

  const validatePhone = (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordStrength(checkPasswordStrength(event.target.value));
  };

  const redirectUser = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        router.push("/");
        return;
      }

      const userDocData = userDoc.data() as AppUserDocument;
      router.push(
        userDocData.userType === "employer"
          ? "/employer-dashboard"
          : "/worker-dashboard",
      );
    } catch (error) {
      console.error("Redirect error:", error);
      setErrors({
        general: "Error redirecting to dashboard. Please try logging in again.",
      });
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setErrors({ general: "Authentication is not available right now." });
      return;
    }

    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const nextUserType = parseUserType(getStringFormValue(formData, "userType"));
    const name = getStringFormValue(formData, "registerName");
    const phone = getStringFormValue(formData, "registerPhone");
    const email = getStringFormValue(formData, "registerEmail");
    const password = getStringFormValue(formData, "registerPassword");
    const confirmPassword = getStringFormValue(formData, "registerConfirmPassword");

    const nextErrors: ModalErrors = {};

    if (!validatePhone(phone)) {
      nextErrors.phone = "Please enter a valid phone number";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email || `${phone}@manualink.com`,
        password,
      );

      const userData: AppUserDocument = {
        userType: nextUserType,
        name,
        phone,
        email: email || null,
        bio: "",
        skills: [],
        savedJobs: [],
        alertSubscriptions: [],
        createdAt: new Date(),
      };

      if (nextUserType === "worker") {
        const experience = getStringFormValue(formData, "experience") || "Beginner";
        const availability = getStringFormValue(formData, "availability") || "Full-time";
        const hourlyRateValue = getStringFormValue(formData, "hourlyRate");
        const location = getStringFormValue(formData, "location");

        userData.profile = {
          skills: [],
          experience,
          availability,
          certifications: [],
          rating: null,
          location: location || null,
          hourlyRate: hourlyRateValue ? Number.parseFloat(hourlyRateValue) : null,
        };
      } else {
        userData.profile = {
          companyName: getStringFormValue(formData, "companyName"),
          companySize: getStringFormValue(formData, "companySize"),
          industry: getStringFormValue(formData, "industry"),
          rating: null,
          location: null,
        };
      }

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      closeModal();
      await redirectUser(userCredential.user.uid);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
        setErrors({
          general: "This email is already registered. Please try logging in.",
        });
      } else {
        setErrors({
          general: error instanceof Error ? error.message : "Registration failed.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setErrors({ general: "Authentication is not available right now." });
      return;
    }

    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const identifier = getStringFormValue(formData, "loginEmail");
    const password = getStringFormValue(formData, "loginPassword");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizeLoginIdentifier(identifier),
        password,
      );

      closeModal();
      await redirectUser(userCredential.user.uid);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof FirebaseError && error.code === "auth/user-not-found") {
        setErrors({ general: "No account found with these credentials." });
      } else if (
        error instanceof FirebaseError &&
        error.code === "auth/wrong-password"
      ) {
        setErrors({ general: "Incorrect password. Please try again." });
      } else {
        setErrors({
          general: error instanceof Error ? error.message : "Login failed.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {activeModal === "login" && (
        <ModalWrapper active={true} onClose={closeModal}>
          <h2 className="mb-4 text-2xl font-semibold">Login to Your Account</h2>
          {errors.general && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
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
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="loginPassword"
                placeholder="Password"
                required
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <PasswordFieldToggle
                showPassword={showPassword}
                onToggle={() => setShowPassword((value) => !value)}
              />
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
              className={`flex w-full items-center justify-center rounded bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setActiveModal("register")}
              >
                Register
              </button>
            </p>
          </form>
        </ModalWrapper>
      )}

      {activeModal === "register" && (
        <ModalWrapper active={true} onClose={closeModal}>
          <h2 className="mb-4 text-2xl font-semibold">Create an Account</h2>
          {errors.general && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
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
                  checked={userType === "worker"}
                  onChange={() => setUserType("worker")}
                />
                <span>Worker</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="userType"
                  value="employer"
                  checked={userType === "employer"}
                  onChange={() => setUserType("employer")}
                />
                <span>Employer</span>
              </label>
            </div>

            <div>
              <input
                type="text"
                name="registerName"
                placeholder={userType === "worker" ? "Full Name" : "Your Name"}
                required
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {userType === "employer" && (
              <div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  required
                  className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <input
                type="tel"
                name="registerPhone"
                placeholder="Phone Number (e.g., +254711929567)"
                required
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <input
                type="email"
                name="registerEmail"
                placeholder="Email (Optional)"
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {userType === "worker" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <select
                      name="availability"
                      className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      placeholder="e.g., 1500"
                      min="0"
                      step="0.01"
                      className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="City, County"
                      className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {userType === "employer" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <select
                    name="industry"
                    className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <PasswordFieldToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                />
              </div>
              <PasswordStrength strength={passwordStrength} />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="registerConfirmPassword"
                placeholder="Confirm Password"
                required
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <label className="flex items-start space-x-2 text-sm">
              <input type="checkbox" required className="mt-1 rounded" />
              <span>
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              className={`flex w-full items-center justify-center rounded bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setActiveModal("login")}
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
