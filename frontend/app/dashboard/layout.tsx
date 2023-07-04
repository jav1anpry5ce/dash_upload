"use client";

import { AppContext } from "@/context/AppContext";
import { FolderOption, CreateModal, UploadPopUp } from "../../components";
import { useContext, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const updateOpen = () => {
    setOpen((prev) => !prev);
  };
  const { updateProfileOpen } = useContext(AppContext);

  return (
    <div
      className="flex w-full flex-col"
      onClick={() => updateProfileOpen(false)}
    >
      <UploadPopUp />
      <FolderOption updateOpen={updateOpen} />
      <CreateModal open={open} updateOpen={updateOpen} />
      <div className="p-2 lg:px-10 lg:py-2.5">{children}</div>
    </div>
  );
}
