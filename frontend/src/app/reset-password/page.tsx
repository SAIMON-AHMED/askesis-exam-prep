"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const effectiveToken = token.trim() || tokenParam.trim();
    if (!effectiveToken) {
      setError("Password reset token is missing. Please use the link provided in your email.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token: effectiveToken,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to reset password. The link may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card fade-in" style={{ maxWidth: 440, margin: "48px auto", padding: "32px", textAlign: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            color: "#16a34a",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: 24,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Password Reset Complete</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>
        <Link
          href="/login"
          className="btn-primary"
          style={{
            display: "inline-block",
            width: "100%",
            padding: "11px 16px",
            textAlign: "center",
            fontWeight: 600,
            borderRadius: 8,
          }}
        >
          Proceed to Log in →
        </Link>
      </div>
    );
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
          🔒
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Set New Password</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          {emailParam ? (
            <>
              Resetting password for <strong>{emailParam}</strong>
            </>
          ) : (
            "Enter your new password below."
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {!tokenParam && (
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="reset-token"
              style={{ display: "block", marginBottom: 6, fontWeight: 500, fontSize: 14 }}
            >
              Reset Token
            </label>
            <input
              id="reset-token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token from reset email"
              required
              disabled={loading}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8 }}
            />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="new-password"
            style={{ display: "block", marginBottom: 6, fontWeight: 500, fontSize: 14 }}
          >
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            disabled={loading}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="confirm-password"
            style={{ display: "block", marginBottom: 6, fontWeight: 500, fontSize: 14 }}
          >
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
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
          <span>{loading ? "Updating password..." : "Update Password"}</span>
        </button>

        <p style={{ marginTop: 20, fontSize: "0.9rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
          <Link href="/login" style={{ color: "var(--color-primary, #2563eb)", fontWeight: 500 }}>
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: 440, margin: "48px auto", textAlign: "center", padding: "32px" }}>
          <div className="card">Loading reset form...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
