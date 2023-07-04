"use client";

import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateProfileOpen } = useContext(AppContext);
  return (
    <div
      className="flex w-full flex-col"
      onClick={() => updateProfileOpen(false)}
    >
      <div>{children}</div>
    </div>
  );
}
