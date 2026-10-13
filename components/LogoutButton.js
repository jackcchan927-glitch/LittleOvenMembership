"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui";

export default function LogoutButton({ scope }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch(`/api/${scope}/logout`, { method: "POST" });
    router.push(`/${scope}/login`);
    router.refresh();
  }

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
      Log out
    </Button>
  );
}
