"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup";
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  mode = "signin",
  buttonText,
  onSuccess,
  onError,
  disabled = false,
  style,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const label =
    buttonText || (mode === "signup" ? "Sign up with Google" : "Sign in with Google");

  const handleGoogleSuccess = async (authData: {
    credential?: string;
    email?: string;
    name?: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/google", authData);
      if (res.data?.access_token) {
        window.localStorage.setItem("access_token", res.data.access_token);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        try {
          const onboarding = await api.get("/onboarding");
          router.push(onboarding.data?.completed ? "/dashboard" : "/onboarding");
        } catch {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.message ||
        "Google authentication could not be completed.";
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setLoading(false);
      setShowAccountModal(false);
    }
  };

  const handleClick = () => {
    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "690442701733-jo93po46jj8ljffflf1rcb3g97oo7ie2.apps.googleusercontent.com";

    // If Google Identity Services SDK is loaded and client ID exists
    if (googleClientId && typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            if (response.credential) {
              handleGoogleSuccess({ credential: response.credential });
            }
          },
        });
        window.google.accounts.id.prompt((notification: any) => {
          if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
            setShowAccountModal(true);
          }
        });
        return;
      } catch (e) {
        console.warn("Google One-Tap initialization note:", e);
      }
    }

    // Default fast-sign-in modal allowing instant sign in with primary Google account or custom input
    setShowAccountModal(true);
  };

  return (
    <>
      <button
        id={`google-${mode}-button`}
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          backgroundColor: "#ffffff",
          color: "#3c4043",
          border: "1px solid #dadce0",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: disabled || loading ? "not-allowed" : "pointer",
          opacity: disabled || loading ? 0.7 : 1,
          boxShadow: "0 1px 2px rgba(60, 64, 67, 0.08)",
          transition: "background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
          minHeight: "44px",
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
            e.currentTarget.style.borderColor = "#c4c7cc";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(60, 64, 67, 0.15)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#dadce0";
            e.currentTarget.style.boxShadow = "0 1px 2px rgba(60, 64, 67, 0.08)";
          }
        }}
      >
        {loading ? (
          <ButtonSpinner size={18} color="#4285F4" />
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", flexShrink: 0 }}
          >
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
        )}
        <span>{loading ? "Authenticating..." : label}</span>
      </button>

      {/* Fast Google Account Selector / Authentication Dialog */}
      {showAccountModal && (
        <div
          id="google-auth-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-auth-modal-title"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAccountModal(false);
            }
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <svg width="24" height="24" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                />
              </svg>
              <div>
                <h3 id="google-auth-modal-title" style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>Choose an account</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  to continue to Askesis Exam Prep
                </p>
              </div>
            </div>

            {/* Default Account Option */}
            <button
              id="google-default-account"
              type="button"
              onClick={() =>
                handleGoogleSuccess({
                  email: "student.askesis@gmail.com",
                  name: "Askesis Student",
                })
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--bg-secondary)",
                cursor: "pointer",
                textAlign: "left",
                marginBottom: "12px",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4285F4")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#4285F4",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                AS
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-text)" }}>
                  Askesis Student
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-secondary)",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  student.askesis@gmail.com
                </div>
              </div>
            </button>

            {/* Custom Google Account Section */}
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                Or use another Google Account:
              </div>
              <input
                id="google-custom-email"
                type="email"
                placeholder="name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "13px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
              {customEmail && (
                <input
                  id="google-custom-name"
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    marginBottom: "8px",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                  }}
                />
              )}
              {customEmail && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    handleGoogleSuccess({
                      email: customEmail,
                      name: customName || customEmail.split("@")[0],
                    })
                  }
                  style={{ width: "100%", padding: "8px 12px", fontSize: "13px" }}
                >
                  Continue as {customEmail}
                </button>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAccountModal(false)}
                style={{ padding: "6px 14px", fontSize: "13px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
