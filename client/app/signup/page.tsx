"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { signup, login, getProfile } from "@/app/api/auth.service";
import { useAuthStore } from "@/app/store/authStore";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const signupResponse = await signup(username.trim(), email.trim(), password);
      const signupToken =
        signupResponse.data?.data?.token ||
        signupResponse.data?.token ||
        signupResponse.data?.accessToken ||
        null;

      let token = signupToken;

      if (!token) {
        const loginResponse = await login(email.trim(), password);
        token =
          loginResponse.data?.data?.token ||
          loginResponse.data?.token ||
          loginResponse.data?.accessToken ||
          null;
      }

      if (!token) {
        setError("Signup succeeded but automatic login failed. Please login manually.");
        setIsSubmitting(false);
        return;
      }

      setAuth({ token, user: null });

      try {
        const profileResponse = await getProfile();
        const user = profileResponse.data?.data?.user || profileResponse.data?.user || null;
        setAuth({ token, user });
      } catch {
        setAuth({ token, user: null });
      }

      router.replace("/");
    } catch {
      setError("Unable to create account. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 text-white sm:py-8 lg:py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl items-center px-4 sm:px-6 lg:px-10">
        <section className="w-full max-w-xl rounded-xl border border-[#1F1F1F] bg-[#111] p-5 sm:p-6">
          <header className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Authentication</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tighter sm:text-4xl">Create Account</h1>
            <p className="mt-2 text-sm text-gray-400">Sign up to start tracking focused sessions.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-[#1F1F1F] bg-background px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-[#1F1F1F] bg-background px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-[#1F1F1F] bg-background px-4 py-3 pr-11 text-sm text-white focus:border-primary/50 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-gray-400 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded border border-[#1F1F1F] bg-background px-4 py-3 pr-11 text-sm text-white focus:border-primary/50 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-gray-400 transition-colors hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex flex-col items-start justify-between gap-3 pt-1 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded bg-primary px-5 py-3 text-xs font-bold font-mono uppercase text-black transition-all hover:bg-primary/80 disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" /> {isSubmitting ? "Creating..." : "Create Account"}
              </button>

              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
