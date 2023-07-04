"use client";
import { useSession } from "next-auth/react";
import { ClickableIcon } from "../../components";
import { useEffect, useState, useCallback, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  const { data: session } = useSession({ required: true });
  const [folders, setFolders] = useState([]);
  const { revalidate } = useContext(AppContext);

  const getFiles = useCallback(async () => {
    if (session?.user && session?.token) {
      const res = await fetch(`http://api.fileserver.home/folders`, {
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Authorization: session.token,
        },
      });
      const folders = await res.json();
      setFolders(folders);
    }
  }, [session?.user, session?.token]);

  useEffect(() => {
    getFiles();
  }, [getFiles, revalidate]);

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
