"use client";

import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface UserData {
  apiKey: string;
  apiUrl: string;
  credits: number;
}

export default function App() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      fetch("https://filepoint-backend.onrender.com/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.primaryEmailAddress?.emailAddress }),
      })
        .then(res => res.json())
        .then(data => setUserData(data));
    }
  }, [user]);

  return (
    <>
      <SignedIn>
        {!userData ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your API Dashboard</h1>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-sm font-medium text-gray-500">API Key</h2>
                    <div className="mt-1 flex items-center">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {userData.apiKey}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(userData.apiKey)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-sm font-medium text-gray-500">API URL</h2>
                    <div className="mt-1">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        https://filepoint-backend.onrender.com
                      </code>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-sm font-medium text-gray-500">Available Credits</h2>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-blue-600">{userData.credits}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-sm font-medium text-gray-500">Mail here to recharge credits</h2>
                    <div className="mt-1">
                      <a
                        href="mailto:support@formpilot.org"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        support@formpilot.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
