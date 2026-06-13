"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, KeyRound, Save } from "lucide-react";
import { changePassword } from "@/app/api/auth.service";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await changePassword(currentPassword, newPassword);

      if (response.status !== 200) {
        setError(response.statusText || "Failed to change password.");
        setIsSubmitting(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully.");
    } catch {
      setError("Unable to update password right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>

        <header>
          <span className="text-primary font-mono text-xs tracking-widest uppercase">Security Center</span>
          <h1 className="text-4xl font-bold tracking-tighter mt-2">Change Password</h1>
        </header>

        <section className="bg-[#111] border border-[#1F1F1F] p-6 rounded-xl max-w-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Credentials Update
            </h2>
            <p className="text-sm text-gray-400 mt-2">Use a strong password with at least 6 characters.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-background border border-[#1F1F1F] px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-[#1F1F1F] px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background border border-[#1F1F1F] px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-primary text-black font-mono font-bold text-xs py-3 px-5 rounded hover:bg-primary/80 transition-all disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}