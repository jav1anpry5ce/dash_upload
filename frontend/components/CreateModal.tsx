"use client";
import { AiFillFolder, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

type Props = {
  open: boolean;
  updateOpen: () => void;
};

export default function CreateModal({ open, updateOpen }: Props) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { revalidateData } = useContext(AppContext);
  const variants = {
    closed: {
      opacity: 0,
      zIndex: -1,
    },
    open: {
      opacity: 1,
      zIndex: 60,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        delayChildren: 0.5,
      },
    },
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;
    if (!session?.token) return;
    const folderName = e.target.name.value;
    const newFolder = pathname.replace("dashboard", "") + "/" + folderName;
    const data = {
      folder: newFolder,
    };
    axios
      .post("http://api.fileserver.home/create-folder", data, {
        headers: {
          Authorization: session?.token,
        },
      })
      .then(() => {
        e.target.reset();
        updateOpen();
        revalidateData();
      });
  };

  return (
    <motion.div
      variants={variants}
      initial="closed"
      animate={open ? "open" : "closed"}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur"
      onClick={() => updateOpen()}
    >
      <form
        onSubmit={submitForm}
        className="flex w-[450px] flex-col rounded bg-white text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-2">
          <div className="flex items-center gap-2">
            <AiFillFolder fontSize={60} className="text-teal-700" />
            <p className="text-lg">Create Folder</p>
          </div>
          <button
            onClick={() => updateOpen()}
            className="transition-colors duration-200 hover:text-red-500"
          >
            <AiOutlineClose fontSize={20} />
          </button>
        </div>
        <div className="h-[1px] w-full bg-gray-900/50" />
        <div className="flex flex-col space-y-1 p-2">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            className="appearance-none rounded bg-slate-950/90 p-1.5 text-white outline-none ring-1 ring-black/25 focus-within:ring-black/50 hover:ring-black/50"
          />
        </div>
        <div className="flex items-center justify-end gap-2 p-2">
          <button
            className="rounded bg-red-600 p-2 px-4 text-white"
            onClick={() => updateOpen()}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded bg-green-700 p-2 px-4 text-white"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </motion.div>
  );
}
