"use client";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export const useUploadFile = (url: string) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(true);
  const { data: session } = useSession();

  const uploadFile = async (formData: FormData) => {
    setProgress(0);
    setUploading(true);
    if (!session?.token) return;
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: session?.token,
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const progress = (progressEvent.loaded / progressEvent?.total) * 100;
          setProgress(progress);
        },
      })
      .then(() => {
        setIsSuccess(true);
        toast.success("File uploaded!", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
        });
      })
      .catch((err) => {
        console.error(err);
        if (err?.response) {
          toast.error(err.response.data.message, {
            position: "bottom-right",
            autoClose: 3000,
            theme: "dark",
          });
        } else {
          toast.error("Upload cancelled!", {
            position: "bottom-right",
            autoClose: 3000,
            theme: "dark",
          });
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return { uploadFile, isSuccess, progress, uploading };
};
