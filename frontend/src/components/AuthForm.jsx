import { useState } from "react";

export default function AuthForm({ mode = "login", onSubmit, loading }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto space-y-4 p-6 rounded-lg border">
      <h1 className="text-2xl font-semibold">{isRegister ? "Create account" : "Sign in"}</h1>

      {isRegister && (
        <input
          name="name" placeholder="Full name" className="w-full border p-2 rounded"
          value={form.name} onChange={handle} required
        />
      )}

      <input
        name="email" type="email" placeholder="Email" className="w-full border p-2 rounded"
        value={form.email} onChange={handle} required
      />
      <input
        name="password" type="password" placeholder="Password" className="w-full border p-2 rounded"
        value={form.password} onChange={handle} required minLength={6}
      />

      <button
        disabled={loading}
        className="w-full py-2 rounded bg-black text-white disabled:opacity-60"
      >
        {loading ? "Please wait..." : isRegister ? "Sign up" : "Sign in"}
      </button>
    </form>
  );
}
