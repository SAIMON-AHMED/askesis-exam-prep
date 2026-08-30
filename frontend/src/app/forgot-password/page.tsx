"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", {
        email,
        new_password: newPassword,
      });
      setMessage(res.data.message || "Password reset successful.");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Unable to reset password right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card fade-in" style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1>Reset your password</h1>
      <p>Enter your email and choose a new password.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="reset-email">Email</label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
        />

        <label htmlFor="reset-confirm-password">Confirm new password</label>
        <input
          id="reset-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          required
        />

        {message && (
          <div className={message.includes("successful") ? "alert alert-success" : "alert alert-error"} role="alert">
            {message}
          </div>
        )}

        <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: "0.9rem", textAlign: "center" }}>
        <Link href="/login">Back to login</Link>
      </p>
    </div>
  );
}
