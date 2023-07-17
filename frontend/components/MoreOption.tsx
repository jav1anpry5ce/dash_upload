"use client";
import { motion, AnimatePresence } from "framer-motion";
import { BsTrash2, BsCloudDownloadFill, BsShare } from "react-icons/bs";
import { BiRename } from "react-icons/bi";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";

type MousePosition = {
  x: number;
  y: number;
};

type Props = {
  open: boolean;
  mousePosition: MousePosition;
  updateOpen: () => void;
  file: string;
  updateIsRenaming: () => void;
};

export default function MoreOption({
  open,
  mousePosition,
  updateOpen,
  file,
  updateIsRenaming,
}: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { revalidateData } = useContext(AppContext);

  const variants = {
    closed: {
      opacity: 0,
      zIndex: -1,
    },
    open: {
      opacity: 1,
      zIndex: 100,
    },
  };

  const deleteFile = async () => {
    const uri =
      pathname.replace("dashboard", `${session?.user?.email}`) + "/" + file;
    await axios.delete("http://api.fileserver.home/delete", {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.token,
      },
      data: {
        uri: uri,
      },
    });
    revalidateData();
    updateOpen();
  };

  const downloadFile = async () => {
    updateOpen();
    const filePath =
      pathname.replace("dashboard", `${session?.user?.email}`) + "/" + file;
    const folder = file.split("/").at(-1);
    if (folder?.split(".")[1] === undefined || null) {
      const element = document.createElement("a");
      element.href =
        `http://api.fileserver.home/download-folder?uri=` + filePath;
      element.download = file;
      document.body.appendChild(element);
      element.click();
      return;
    }
    const element = document.createElement("a");
    element.href = `http://api.fileserver.home/download-file?uri=` + filePath;
    element.download = file;
    document.body.appendChild(element);
    element.click();
  };

  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  }

  const copyToClipboard = (content: string) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    } else {
      unsecuredCopyToClipboard(content);
    }
  };

  const shareFile = async () => {
    const filePath =
      pathname.replace("dashboard", `${session?.user?.email}`) + "/" + file;
    const res = await axios.post(
      "http://api.fileserver.home/share-folder",
      {
        uri: filePath,
      },
      {
        headers: {
          Authorization: session?.token,
        },
      }
    );
    const link = `${process.env.NEXT_PUBLIC_URL}/${res.data.share_token}`;
    copyToClipboard(link);
    toast.success("Link copied to clipboard", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
    updateOpen();
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={variants}
        initial="closed"
        animate={open ? "open" : "closed"}
        className="fixed inset-0 bg-black/20"
        onClick={() => updateOpen()}
      >
        <div
          className="w-[250px] bg-white py-3 text-black/80 shadow-lg shadow-black/40"
          style={{
            position: "absolute",
            top: mousePosition.y + 15,
            left: mousePosition.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="inline-flex w-full items-center gap-2 p-2 transition duration-200 hover:bg-gray-500/20 hover:text-red-600"
            onClick={() => deleteFile()}
          >
            <BsTrash2 fontSize={20} />
            <p>Delete</p>
          </button>
          <button
            onClick={() => downloadFile()}
            className="inline-flex w-full items-center gap-2 p-2 transition duration-200 hover:bg-gray-500/20 hover:text-black"
          >
            <BsCloudDownloadFill fontSize={20} />
            <p>Download</p>
          </button>
          <button
            onClick={() => shareFile()}
            className="inline-flex w-full items-center gap-2 p-2 transition duration-200 hover:bg-gray-500/20 hover:text-black"
          >
            <BsShare fontSize={20} />
            <p>Share</p>
          </button>
          <button
            onClick={() => {
              updateIsRenaming();
              updateOpen();
            }}
            className="inline-flex w-full items-center gap-2 p-2 transition duration-200 hover:bg-gray-500/20 hover:text-black"
          >
            <BiRename fontSize={20} />
            <p>Rename</p>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
