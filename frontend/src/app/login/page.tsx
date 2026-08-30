"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateEmail(value: string): string | null {
    if (!value.trim()) {
      return "Email address is required.";
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    return null;
  }

  function validatePassword(value: string): string | null {
    if (!value) {
      return "Password is required.";
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }
    return null;
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setEmailError(validateEmail(val));
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      setPasswordError(validatePassword(val));
    }
  }

  function handleBlur(field: "email" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setEmailError(validateEmail(email));
    } else if (field === "password") {
      setPasswordError(validatePassword(password));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setTouched({ email: true, password: true });
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email: email.trim(), password });
      window.localStorage.setItem("access_token", res.data.access_token);
      try {
        const onboarding = await api.get("/onboarding");
        router.push(onboarding.data.completed ? "/dashboard" : "/onboarding");
      } catch {
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password. Please check your credentials and try again.");
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

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "14px" }}>
          <label htmlFor="login-email" style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "login-email-error" : undefined}
            disabled={loading}
            style={{
              borderColor: emailError ? "var(--color-danger, #ef4444)" : undefined,
              width: "100%",
            }}
          />
          {emailError && (
            <p id="login-email-error" style={{ color: "#ef4444", fontSize: "13px", margin: "4px 0 0" }}>
              {emailError}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="login-password" style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur("password")}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "login-password-error" : undefined}
            disabled={loading}
            style={{
              borderColor: passwordError ? "var(--color-danger, #ef4444)" : undefined,
              width: "100%",
            }}
          />
          {passwordError && (
            <p id="login-password-error" style={{ color: "#ef4444", fontSize: "13px", margin: "4px 0 0" }}>
              {passwordError}
            </p>
          )}
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: "16px" }}>
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
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.85 : 1,
            transition: "all 0.15s ease",
          }}
        >
          {loading && <ButtonSpinner size={18} color="#ffffff" />}
          <span>{loading ? "Logging in..." : "Log in"}</span>
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: "0.9rem", textAlign: "center" }}>
        <Link href="/forgot-password" style={{ color: "var(--color-primary, #2563eb)", fontWeight: 500 }}>
          Forgot password?
        </Link>
      </p>
      <p style={{ marginTop: 8, fontSize: "0.9rem", textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--color-primary, #2563eb)", fontWeight: 500 }}>
          Create one
        </Link>
      </p>
    </div>
  );
}
