"use client";
import { useSession } from "next-auth/react";
import { ClickableIcon } from "../../../components";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { notFound } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function Page({ params }: { params: { folder: string[] } }) {
  const { data: session } = useSession({ required: true });
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(false);
  const { revalidate } = useContext(AppContext);

  const getFiles = useCallback(async () => {
    if (session?.user && session?.token) {
      const res = await fetch(
        `http://api.fileserver.home/${params.folder.join("/")}`,
        {
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            Authorization: session?.token,
          },
        }
      );
      if (res.ok) {
        const folders = await res.json();
        setFolders(folders);
      } else {
        setError(true);
      }
    }
  }, [session?.user, params, session?.token]);

  useEffect(() => {
    getFiles();
  }, [getFiles, revalidate]);

  if (error) notFound();

  return (
    <div className="flex flex-wrap items-start justify-center gap-4 lg:justify-start">
      <AnimatePresence>
        {folders.map((file: string) => (
          <ClickableIcon key={file} file={file} />
        ))}
      </AnimatePresence>
    </div>
  );
}
