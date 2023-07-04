"use client";

import { AppContext } from "@/context/AppContext";
import { useUploadFile } from "@/hook/useUploadFile";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiRefresh } from "react-icons/bi";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";

export default function UploadPopUp() {
  const { files } = useContext(AppContext);
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (files.length > 0) setShow(true);
    else setShow(false);
  }, [files]);

  const variants = {
    show: {
      y: 5,
      transition: {
        duration: 0.5,
      },
    },
    hide: {
      y: 1000,
    },
  };

  const var2 = {
    open: {
      height: 650,
      transition: {
        duration: 0.3,
      },
    },
    close: {
      height: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hide"
      animate={show ? "show" : "hide"}
      className="fixed bottom-0 right-5 z-50 flex w-[391px] flex-col overflow-hidden rounded-t bg-white/5 shadow shadow-teal-700/10 backdrop-blur"
    >
      <div className="flex w-full items-center justify-between bg-black p-2 text-white">
        <p className="text-sm">Uploads</p>
        <motion.button
          initial={{ rotate: 0 }}
          animate={
            open
              ? {
                  rotate: 0,
                }
              : { rotate: 180 }
          }
          transition={{
            duration: 0.3,
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <AiOutlineDown fontSize={16} />
        </motion.button>
      </div>
      <motion.div
        variants={var2}
        initial="open"
        animate={open ? "open" : "close"}
        className="space-y-2 overflow-y-auto overflow-x-hidden p-2 scrollbar-hide"
      >
        {files.map((file: any) => (
          <PopUp key={file.lastModified} file={file} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function PopUp({ file }: { file: any }) {
  const { isSuccess, uploadFile, progress, uploading } = useUploadFile(
    "http://api.fileserver.home/upload"
  );
  const pathname = usePathname();
  const { data: session } = useSession();
  const { revalidateData, removeFileFromFiles } = useContext(AppContext);
  const [tryAgain, setTryAgain] = useState(false);

  const handelUpload = async () => {
    if (!session?.user?.email) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "folder",
      pathname.replace("dashboard", session?.user?.email)
    );
    await uploadFile(formData);
  };

  useEffect(() => {
    handelUpload();
    // eslint-disable-next-line
  }, [tryAgain]);

  const handelRemove = () => {
    removeFileFromFiles(file);
  };

  useEffect(() => {
    if (isSuccess) {
      revalidateData();
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  return (
    <div className="relative w-[375px] shrink-0 overflow-hidden bg-white p-1.5 text-sm text-gray-800">
      <button className="absolute right-2 top-1" onClick={handelRemove}>
        <AiOutlineClose />
      </button>
      <div className="flex w-full flex-col gap-1">
        <p className="text-sx w-full truncate">{file.name}</p>
        <div className="flex items-center justify-between gap-1">
          <progress
            className={`${
              uploading
                ? "progress-accent"
                : !isSuccess
                ? "progress-error"
                : isSuccess && "progress-accent"
            } progress h-1.5 w-full`}
            value={Math.round(progress)}
            max="100"
          ></progress>
          <div className="flex items-center">
            {uploading && (
              <p className="w-full shrink-0 text-xs text-black">
                {Math.round(progress)}%
              </p>
            )}
            {!uploading && !isSuccess && (
              <button
                className="m-0 shrink-0 p-0"
                onClick={() => setTryAgain((prev) => !prev)}
              >
                <BiRefresh fontSize={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
