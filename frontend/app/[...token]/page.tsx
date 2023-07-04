import { ClickableIcon } from "@/components";
import BreadCrumbs from "@/components/BreadCrumbs";
import { notFound } from "next/navigation";

async function getSharedLink(path: string[]) {
  const token = path[0];
  const arr = [...path];
  arr.splice(0, 1).join("/");
  const res = await fetch(
    `http://api.fileserver.home/share?token=${token}&uri=${arr.join("/")}`,
    {
      cache: "no-store",
    }
  );
  if (res.ok) {
    return await res.json();
  } else {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: { token: string[] };
}) {
  const files = await getSharedLink(params.token);
  if (!files) notFound();
  return (
    <div>
      <BreadCrumbs links={...params.token} />
      <div className="flex flex-wrap items-start gap-4 p-2 lg:px-10 lg:py-2.5">
        {files.map((file: string) => (
          <ClickableIcon key={file} file={file} />
        ))}
      </div>
    </div>
  );
}
