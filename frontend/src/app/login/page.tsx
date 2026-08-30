"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      window.localStorage.setItem("access_token", res.data.access_token);
      try {
        const onboarding = await api.get("/onboarding");
        router.push(onboarding.data.completed ? "/dashboard" : "/onboarding");
      } catch {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card fade-in" style={{ maxWidth: 400, margin: "48px auto" }}>
      <h1>Log in</h1>
      <p style={{ marginBottom: "20px" }}>Welcome back — pick up where you left off.</p>

      <div style={{ marginBottom: "18px" }}>
        <GoogleSignInButton mode="signin" onError={(msg) => setError(msg)} />
      </div>

      <div style={{ display: "flex", alignItems: "center", margin: "18px 0", gap: "12px" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          or continue with
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: "0.9rem", textAlign: "center" }}>
        <Link href="/forgot-password">Forgot password?</Link>
      </p>
      <p style={{ marginTop: 8, fontSize: "0.9rem", textAlign: "center" }}>
        Don&apos;t have an account? <Link href="/register">Create one</Link>
      </p>
    </div>
  );
}
