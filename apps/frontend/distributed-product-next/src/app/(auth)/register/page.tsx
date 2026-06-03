"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { swal } from "@/lib/swal";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
    if (!/[^a-zA-Z0-9]/.test(value)) return "Password must contain at least one special character.";
    return "";
  };

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    if (!confirmPassword) {
      setError("Confirm password is required.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const canSubmit =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    validatePassword(password) === "" &&
    confirmPassword !== "" &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError("");

      const result = await authService.register({
        fullName,
        email,
        password,
      });

      await swal.success(
        "สมัครสมาชิกสำเร็จ",
        result.message || "กรุณาเข้าสู่ระบบ"
      );

      router.push("/login");
    } catch (error) {
      await swal.error(
        "สมัครสมาชิกไม่สำเร็จ",
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-card">
      <form onSubmit={handleSubmit}>
        <h1 className="form-title">Create Account</h1>

        <p className="form-subtitle">เริ่มต้นใช้งานระบบ</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="john@example.com"
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
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isLoading}
          className={`btn w-100 d-flex justify-content-center align-items-center ${
            canSubmit ? "btn-primary" : "btn-secondary"
          }`}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div className="auth-link mt-3">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </form>
    </div>
  );
}