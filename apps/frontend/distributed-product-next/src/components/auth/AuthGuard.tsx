"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type AuthGuardProps = {
  children: React.ReactNode;
  roles?: string[];
};

function hasAccessToken() {
  if (typeof window === "undefined") return false;

  return Boolean(localStorage.getItem("accessToken"));
}

export default function AuthGuard({ children, roles }: AuthGuardProps) {
  const router = useRouter();

  const { user, loading, reloadMe } = useAuth();

  const hasToken = hasAccessToken();

  useEffect(() => {
    const task = window.setTimeout(() => {
      const token = localStorage.getItem("accessToken");

      if (token && !user && !loading) {
        void reloadMe();
      }
    }, 0);

    return () => {
      window.clearTimeout(task);
    };
  }, [user, loading, reloadMe]);

  useEffect(() => {
    const task = window.setTimeout(() => {
      const token = localStorage.getItem("accessToken");

      if (!loading && !user && !token) {
        router.replace("/login");
      }
    }, 0);

    return () => {
      window.clearTimeout(task);
    };
  }, [loading, user, router]);

  if (loading || (!user && hasToken)) {
    return (
      <div className="page-loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ตรวจ role ภายหลังได้
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    router.replace("/unauthorized");
    return null;
  }

  return <>{children}</>;
}