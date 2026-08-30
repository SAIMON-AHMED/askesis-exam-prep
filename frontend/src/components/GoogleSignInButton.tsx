"use client";

import React, { useState } from "react";
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
    }
  };

  const handleClick = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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
          if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
            onError?.("Google sign-in was not displayed. Check your Google account and browser settings.");
          }
        });
        return;
      } catch {
        onError?.("Google sign-in could not be initialized.");
        return;
      }
    }

    onError?.("Google sign-in is not configured or is still loading. Please try again.");
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
          minHeight: "44px",
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
          cursor: disabled || loading ? "not-allowed" : "pointer",
          opacity: disabled || loading ? 0.7 : 1,
          ...style,
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
    </>
  );
}
