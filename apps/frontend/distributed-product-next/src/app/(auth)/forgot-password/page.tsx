"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5067/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถส่งคำขอ reset password ได้");
      }

      setMessage("หากอีเมลนี้มีอยู่ในระบบ ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="panel-right">
        <form onSubmit={handleSubmit}>
          <h1 className="form-title">Forgot Password</h1>

          <p className="form-subtitle">
            กรอกอีเมลเพื่อรับลิงก์ตั้งรหัสผ่านใหม่
          </p>

          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>

            <input
              type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="auth-link">
            <Link href="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}