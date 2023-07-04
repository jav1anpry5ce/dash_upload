"use client";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export default function UploadFiles() {
  const { updateFileList } = useContext(AppContext);
  const handelUpload = (e: any) => {
    for (let i = 0; i < e.target.files.length; i++) {
      updateFileList(e.target.files[i]);
    }
    e.target.value = "";
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-cyan-600/20 px-4 py-1.5 hover:shadow-lg hover:shadow-cyan-600/10">
      <BsFillCloudUploadFill fontSize={24} />
      <p>Upload</p>
      <input type="file" multiple className="hidden" onChange={handelUpload} />
    </label>
  );
}
