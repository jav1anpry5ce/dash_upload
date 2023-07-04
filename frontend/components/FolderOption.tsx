"use client";
import { AiOutlinePlus } from "react-icons/ai";
import UploadFiles from "./UploadFiles";
import { usePathname } from "next/navigation";
import BreadCrumbs from "./BreadCrumbs";
export default function FolderOption({
  updateOpen,
}: {
  updateOpen: () => void;
}) {
  const pathname = usePathname();
  const links = pathname.split("/").filter((e) => e);
  return (
    <div className="sticky top-[51px] z-40 bg-transparent outline-none backdrop-blur-lg lg:top-[67px]">
      <BreadCrumbs links={links} />
      <div className="flex items-center justify-start gap-4 p-2 lg:px-10">
        <UploadFiles />
        <button
          className="inline-flex items-center gap-2 rounded-full bg-gray-400/5 px-4 py-1.5 hover:shadow-lg hover:shadow-gray-400/5"
          onClick={() => updateOpen()}
        >
          <AiOutlinePlus fontSize={24} />
          Create
        </button>
      </div>
    </div>
  );
}
