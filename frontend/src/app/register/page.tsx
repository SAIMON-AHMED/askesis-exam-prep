"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, full_name: fullName });
      router.push("/login");
    } catch (err: any) {
      // Extract actual error message from API response
      const errorMessage = err?.response?.data?.detail || 
                          err?.message || 
                          "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card fade-in" style={{ maxWidth: 400, margin: "48px auto" }}>
      <h1>Create an account</h1>
      <p>Start your adaptive study plan in minutes.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-name">Full name</label>
        <input
          id="register-name"
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: "0.9rem" }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
