"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5067/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (!res.ok) {
        throw new Error("Token ไม่ถูกต้องหรือหมดอายุ");
      }

      router.push("/login");
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
          <h1 className="form-title">Reset Password</h1>

          <p className="form-subtitle">
            ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ
          </p>

          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">New Password</label>

            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>

            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}