"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

const REMEMBER_EMAIL_KEY = "remember_email";
const REMEMBER_PASSWORD_KEY = "remember_password";
const REMEMBER_ME_KEY = "remember_me";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const task = window.setTimeout(() => {
      const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";

      if (savedRememberMe) {
        const savedEmail =
          localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "admin@example.com";

        const savedPassword =
          localStorage.getItem(REMEMBER_PASSWORD_KEY) ?? "";

        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }

      setHasMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(task);
    };
  }, []);

  const canSubmit =
    hasMounted &&
    email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password !== "" &&
    password.length >= 8;

  function saveRememberMe() {
    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, "true");
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
      localStorage.setItem(REMEMBER_PASSWORD_KEY, password);
      return;
    }

    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(REMEMBER_EMAIL_KEY);
    localStorage.removeItem(REMEMBER_PASSWORD_KEY);
  }

  function handleRememberMeChange(checked: boolean) {
    setRememberMe(checked);

    if (!checked) {
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_PASSWORD_KEY);
      setPassword("");
    }
  }

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!canSubmit) return;

  setError("");
  setIsLoading(true);

  /*
    Save before login API.
    This makes Remember Me work even when login fails,
    so refresh will still keep the entered email/password.
  */
  saveRememberMe();

  try {
    const result = await authService.login({
      email,
      password,
      rememberMe,
    });

    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);

    const me = await authService.me();

    if (me.role === "Admin") {
      router.push("/dashboard");
      return;
    }

    if (me.role === "User") {
      router.push("/dashboard/shop");
      return;
    }

    setError("ไม่พบสิทธิ์ผู้ใช้งาน");
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("เกิดข้อผิดพลาด");
    }
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="login-wrapper">
      <div className="panel-left">
        <div className="brand">
          <div className="brand-logo">
            <div className="brand-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>

            <span className="brand-name">DPMS</span>
          </div>

          <h2 className="panel-heading">
            Distributed Product
            <br />
            Management System
          </h2>

          <p className="panel-sub">
            ระบบจัดการสินค้าและออเดอร์แบบครบวงจร สำหรับธุรกิจของคุณ
          </p>
        </div>

        <div className="features">
          <div className="feature-item">
            <div className="feature-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>

            <span>จัดการสินค้าและหมวดหมู่ได้ทันที</span>
          </div>

          <div className="feature-item">
            <div className="feature-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>

            <span>ติดตามออเดอร์แบบ Real-time</span>
          </div>

          <div className="feature-item">
            <div className="feature-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <span>Role-based Access Control</span>
          </div>

          <div className="feature-item">
            <div className="feature-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>

            <span>Dashboard & Analytics</span>
          </div>
        </div>
      </div>

      <div className="panel-right">
        <form onSubmit={handleSubmit}>
          <h1 className="form-title">Welcome back</h1>

          <p className="form-subtitle">เข้าสู่ระบบเพื่อใช้งานระบบ</p>

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

          <div className="form-group">
            <label className="form-label">Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => handleRememberMeChange(e.target.checked)}
              />

              <span>Remember Me</span>
            </label>

            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className={`btn w-100 d-flex justify-content-center align-items-center ${
              canSubmit ? "btn-primary" : "btn-outline-primary"
            }`}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-link">
            Don&apos;t have an account? <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}