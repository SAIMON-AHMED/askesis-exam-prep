"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetLinkPreview, setResetLinkPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setResetLinkPreview(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      setMessage(
        res.data.message ||
          "If an account exists for that email, a password reset link has been sent to your inbox."
      );
      if (res.data.reset_link) {
        setResetLinkPreview(res.data.reset_link);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to process password reset request at this time."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card fade-in" style={{ maxWidth: 440, margin: "48px auto", padding: "32px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            color: "var(--color-primary, #2563eb)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            fontSize: 22,
          }}
        >
          🔑
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Forgot your password?</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          {submitted
            ? "Check your email for instructions to reset your password."
            : "No problem. Enter your email address below and we'll send you a password reset link."}
        </p>
      </div>

      {submitted ? (
        <div className="fade-in">
          <div
            className="alert alert-success"
            role="alert"
            style={{ marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}
          >
            {message}
          </div>

          {resetLinkPreview && (
            <div
              style={{
                backgroundColor: "var(--bg-secondary, #f8fafc)",
                border: "1px dashed var(--color-border, #cbd5e1)",
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 20,
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--color-text)" }}>
                🛠️ Reset Link Preview:
              </div>
              <p style={{ margin: "0 0 8px", color: "var(--color-text-secondary)", fontSize: 12 }}>
                Click below to complete password reset:
              </p>
              <Link
                href={resetLinkPreview}
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  wordBreak: "break-all",
                  textDecoration: "underline",
                }}
              >
                Proceed to Reset Password →
              </Link>
            </div>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSubmitted(false);
              setEmail("");
              setResetLinkPreview(null);
            }}
            style={{ width: "100%", marginBottom: 12, padding: "10px 16px" }}
          >
            Try another email address
          </button>

          <p style={{ marginTop: 16, fontSize: "0.9rem", textAlign: "center" }}>
            <Link href="/login" style={{ color: "var(--color-primary, #2563eb)", fontWeight: 500 }}>
              ← Return to log in
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="reset-email"
              style={{ display: "block", marginBottom: 6, fontWeight: 500, fontSize: 14 }}
            >
              Account email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8 }}
            />
          </div>

          {error && (
            <div
              className="alert alert-error"
              role="alert"
              style={{ marginBottom: 16, fontSize: 14 }}
            >
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            aria-busy={loading}
            style={{
              width: "100%",
              padding: "11px 16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.85 : 1,
              transition: "all 0.15s ease",
            }}
          >
            {loading && <ButtonSpinner size={18} color="#ffffff" />}
            <span>{loading ? "Sending link..." : "Send password reset link"}</span>
          </button>

          <p style={{ marginTop: 20, fontSize: "0.9rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
            Remembered your password?{" "}
            <Link href="/login" style={{ color: "var(--color-primary, #2563eb)", fontWeight: 500 }}>
              Log in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
