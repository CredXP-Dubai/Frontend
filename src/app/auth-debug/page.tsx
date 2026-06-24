"use client";

import axios from "axios";
import { FormEvent, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/api/client";
import { getAccessToken, getRefreshToken } from "@/lib/auth/session";

interface DebugState {
  request: {
    method: string;
    url: string;
    headers: Record<string, string | undefined>;
    body: Record<string, string>;
    credentialsMode: string;
  };
  response: unknown;
  error: unknown;
  status: number | null;
  durationMs: number | null;
}

const initialState: DebugState = {
  request: {
    method: "POST",
    url: "",
    headers: {},
    body: { email: "", password: "" },
    credentialsMode: "omit (axios default; no cookies sent)",
  },
  response: null,
  error: null,
  status: null,
  durationMs: null,
};

export default function AuthDebugPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [debug, setDebug] = useState<DebugState>(initialState);

  const sessionSnapshot = useMemo(
    () => ({
      accessToken: getAccessToken() ? "[present]" : null,
      refreshToken: getRefreshToken() ? "[present]" : null,
    }),
    [debug.status],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const url = `${getApiBaseUrl()}/api/v1/auth/login`;
    const body = { email: email.trim(), password };
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const requestSnapshot = {
      method: "POST",
      url,
      headers,
      body,
      credentialsMode: "omit (axios default; no cookies sent)",
    };

    const started = performance.now();

    try {
      const response = await axios.post(url, body, {
        headers,
        validateStatus: () => true,
      });

      setDebug({
        request: requestSnapshot,
        response: response.data,
        error: null,
        status: response.status,
        durationMs: Math.round(performance.now() - started),
      });
    } catch (caught) {
      setDebug({
        request: requestSnapshot,
        response: null,
        error:
          axios.isAxiosError(caught)
            ? {
                message: caught.message,
                status: caught.response?.status,
                data: caught.response?.data,
              }
            : caught,
        status: axios.isAxiosError(caught) ? (caught.response?.status ?? null) : null,
        durationMs: Math.round(performance.now() - started),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-luxury-bg px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.2em] text-luxury-gold uppercase">Temporary Debug</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light">
            Auth Debug Console
          </h1>
          <p className="text-sm text-luxury-muted">
            Raw login probe against <code className="text-luxury-gold-light">POST /api/v1/auth/login</code>.
            Remove this page after authentication is verified.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-luxury-border bg-white/4 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span className="text-luxury-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-luxury-border bg-black/40 px-4 py-3 outline-none focus:border-luxury-gold/60"
                required
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="text-luxury-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-luxury-border bg-black/40 px-4 py-3 outline-none focus:border-luxury-gold/60"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-luxury-gold px-5 py-3 text-sm font-semibold tracking-wide text-luxury-bg uppercase disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Raw Login Request"}
          </button>
        </form>

        <section className="grid gap-4 lg:grid-cols-2">
          <DebugPanel title="Request Payload" value={debug.request} />
          <DebugPanel title="Session Snapshot" value={sessionSnapshot} />
          <DebugPanel title="Response Body" value={debug.response} />
          <DebugPanel title="Error Body" value={debug.error} />
        </section>

        <div className="rounded-2xl border border-luxury-border bg-white/4 p-4 text-sm text-luxury-muted">
          <p>
            Status: <span className="text-white">{debug.status ?? "—"}</span>
            {" · "}
            Duration: <span className="text-white">{debug.durationMs ?? "—"} ms</span>
          </p>
        </div>
      </div>
    </main>
  );
}

function DebugPanel({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-2xl border border-luxury-border bg-black/50 p-4">
      <h2 className="mb-3 text-xs tracking-[0.16em] text-luxury-gold uppercase">{title}</h2>
      <pre className="max-h-80 overflow-auto text-xs leading-relaxed whitespace-pre-wrap text-luxury-muted">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
