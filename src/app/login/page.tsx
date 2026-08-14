"use client";

import { useState } from "react";
import { signInWithProvider } from "@/actions/auth";
import Image from "@/components/Image";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: "github" | "google") => {
    setError(null);
    setLoading(provider);
    const result = await signInWithProvider(provider);
    if (result?.error) {
      setError(result.error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border-[1px] border-borderGray flex flex-col gap-6">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-3">
          <Image path="icons/logo.svg" alt="Devvit" w={48} h={48} />
          <h1 className="text-2xl font-bold text-textGrayLight">Devvit</h1>
          <p className="text-textGray text-center text-sm">
            Build, ship, and compete. Sign in to start your builder profile.
          </p>
        </div>
        {/* ERROR */}
        {error && (
          <div className="py-2 px-3 rounded-lg bg-iconPink/10 text-iconPink text-sm">
            {error}
          </div>
        )}
        {/* PROVIDERS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSignIn("github")}
            disabled={loading !== null}
            className="py-2.5 px-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"
              />
            </svg>
            {loading === "github" ? "Redirecting..." : "Continue with GitHub"}
          </button>
          <button
            onClick={() => handleSignIn("google")}
            disabled={loading !== null}
            className="py-2.5 px-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading === "google" ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>
        <p className="text-textGray text-xs text-center">
          By continuing, you agree to the Devvit Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
