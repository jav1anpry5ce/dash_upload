"use client";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface AppContextInterface {
  revalidate: boolean;
  profileOpen: boolean;
  revalidateData: () => void;
  updateFileList: (file: any) => void;
  removeFileFromFiles: (file: any) => void;
  updateProfileOpen: (val: boolean) => void;
  files: [];
  usage: string;
  percentage: number;
}

export const AppContext = createContext<AppContextInterface>({
  revalidate: false,
  profileOpen: false,
  revalidateData: () => {},
  updateFileList: (file: any) => {},
  removeFileFromFiles: (file: any) => {},
  updateProfileOpen: (val: boolean) => {},
  files: [],
  usage: "",
  percentage: 0,
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [revalidate, setRevalidate] = useState<boolean>(false);
  const [files, setFiles] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [usage, setUsage] = useState("0 KB");
  const [percentage, setPercentage] = useState(0);
  const { data: session } = useSession();
  const revalidateData = () => {
    setRevalidate((prev) => !prev);
  };
  const updateFileList = (file: any) => {
    setFiles((prev) => [...prev, file]);
  };

  const removeFileFromFiles = (file: any) => {
    setFiles((prev) => prev.filter((f: any) => f.name !== file.name));
  };

  const updateProfileOpen = (val: boolean) => {
    setProfileOpen(val);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const calculatePercentage = (bytes: number) => {
    setPercentage((bytes / 2147483648) * 100);
  };

  const getUsage = useCallback(async () => {
    if (!session) return;
    const res = await fetch(`http://api.fileserver.home/folder-size`, {
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Authorization: session?.token,
      },
    });
    const size = await res.json();
    setUsage(formatBytes(Number(size.size)));
    calculatePercentage(Number(size.size));
  }, [session]);

  useEffect(() => {
    if (revalidate) setRevalidate(false);
  }, [revalidate]);

  useEffect(() => {
    getUsage();
  }, [getUsage, revalidate]);

  return (
    <AppContext.Provider
      value={{
        revalidate,
        revalidateData,
        files,
        updateFileList,
        removeFileFromFiles,
        profileOpen,
        updateProfileOpen,
        usage,
        percentage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
