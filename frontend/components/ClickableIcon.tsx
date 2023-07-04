"use client";

import Link from "next/link";
import Image from "next/image";
import { ImFileText2 } from "react-icons/im";
import { FaFolder } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AiOutlineMore } from "react-icons/ai";
import MoreOption from "./MoreOption";
import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

type MousePosition = {
  x: number;
  y: number;
};

export default function ClickableIcon({ file }: { file: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { revalidateData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const updateOpen = () => {
    setOpen((prev) => !prev);
  };
  const updateIsRenaming = () => {
    setIsRenaming((prev) => !prev);
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const end = file.split(".")[1];

  const handleRename = async () => {
    updateIsRenaming();
    const data = {
      oldName: pathname + "/" + file,
      newName: pathname + "/" + inputRef.current?.value,
    };
    axios
      .post("http://api.fileserver.home/rename", data, {
        headers: {
          Authorization: session?.token,
        },
      })
      .then(() => {
        revalidateData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  const renderIcon = () => {
    if (!session?.user?.email) return;
    if (!end)
      return (
        <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
          <FaFolder fontSize={60} className="text-teal-700" />
        </div>
      );
    switch (end?.toLowerCase()) {
      case "png":
        return (
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
            <Image
              src={`http://api.fileserver.home/download-file?uri=${pathname.replace(
                "dashboard",
                session?.user?.email
              )}/${file}`}
              alt="image"
              width={45}
              height={45}
              className="h-auto w-auto object-cover"
            />
          </div>
        );
      case "jpg":
        return (
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
            <Image
              src={`http://api.fileserver.home/download-file?uri=${pathname.replace(
                "dashboard",
                session?.user?.email
              )}/${file}`}
              alt="image"
              width={45}
              height={45}
              className="h-auto w-auto object-cover"
            />
          </div>
        );
      case "jpeg":
        return (
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
            <Image
              src={`http://api.fileserver.home/download-file?uri=${pathname.replace(
                "dashboard",
                session?.user?.email
              )}/${file}`}
              alt="image"
              width={45}
              height={45}
              className="h-auto w-auto object-cover"
            />
          </div>
        );
      case "txt":
        return (
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
            <ImFileText2 fontSize={60} className="text-teal-700" />
          </div>
        );
      default:
        return (
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
            <ImFileText2 fontSize={60} className="text-teal-700" />
          </div>
        );
    }
  };
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      layout
      key={file}
    >
      <MoreOption
        open={open}
        mousePosition={mousePosition}
        updateOpen={updateOpen}
        file={file}
        updateIsRenaming={updateIsRenaming}
      />
      <div className="group relative flex flex-col items-center justify-center space-y-2 p-2 px-4 transition duration-300 hover:bg-gray-500/20 lg:w-[152px]">
        <div
          className="absolute top-0 hidden rotate-90 self-end group-hover:block"
          onClick={() => setOpen((prev) => !prev)}
          onMouseDown={(e) => {
            setMousePosition({
              x: e.clientX,
              y: e.clientY,
            });
          }}
          role="button"
        >
          <AiOutlineMore fontSize={26} />
        </div>
        {!end ? (
          <Link
            download
            href={`${pathname}/${file}`}
            className="flex flex-col items-center justify-center space-y-2"
            passHref
          >
            {renderIcon()}
            <input
              disabled={!isRenaming}
              ref={inputRef}
              defaultValue={file}
              onBlur={() => handleRename()}
              className="max-w-[120px] cursor-default truncate rounded bg-transparent py-0.5 text-center text-xs outline-none transition duration-300 focus-within:ring-1 focus-within:ring-gray-700/30"
            />
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {renderIcon()}
            <input
              disabled={!isRenaming}
              ref={inputRef}
              defaultValue={file}
              onBlur={() => handleRename()}
              className="max-w-[120px] cursor-default truncate rounded bg-transparent py-0.5 text-center text-xs outline-none transition duration-300 focus-within:ring-1 focus-within:ring-gray-700/30"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
