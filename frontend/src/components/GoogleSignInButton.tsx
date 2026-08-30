"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

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
        {loading ? "Authenticating..." : label}
      </button>
    </>
  );
}
