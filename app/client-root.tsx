"use client";

import { useState, useEffect, ReactNode } from "react";
import { getMe } from "@/src/features/auth/me/model";
import AuthLayout from "@/src/shared/layouts";
import { NavBar } from "@/src/widgets/navbar";
import { LoaderOverlay } from "@/src/shared/mantine/loader";
import "@mantine/core/styles.css";
import { useRouter } from "next/navigation";

export default function ClientRoot({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const res = await getMe();
      setUser(res.user);
      setLoaded(true);
    }
    loadUser();
  }, []);

  async function reloadUser() {
    const res = await getMe();

    if (res.user) {
      setUser(res.user);
      router.refresh();
    }
  }

  if (!loaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <LoaderOverlay />
      </div>
    );
  }

  return (
    <div className="flex w-full">
      {user ? (
        <NavBar user={user} />
      ) : (
        <AuthLayout user={user} open={!user} reloadUser={reloadUser} />
      )}

      <main className="w-full bg-blue-50 min-h-screen py-3 px-5">
        {children}
      </main>
    </div>
  );
}
