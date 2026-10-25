
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      const token = data.token;

      if (!token) {
        setError("Login API did not return a token.");
        return;
      }

      localStorage.setItem("token", token);
      setToken(token);
      router.push("/dashboard");
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen bg-gray-100">
      <header className="flex items-center justify-center bg-white px-6 py-8 shadow-sm">
        <h1 className="text-xl font-bold text-blue-700">
          Patient Management
        </h1>
      </header>

      <div className="flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Patient Portal
          </h1>

          <p className="text-gray-500">
            Login to your account
          </p>

          <input
            className="w-full rounded-lg border p-3"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className="w-full rounded-lg border p-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}

            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
