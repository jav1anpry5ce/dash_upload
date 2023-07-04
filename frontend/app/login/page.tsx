"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { data: session } = useSession();
  if (session?.user) {
    return redirect("/dashboard");
  }
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex h-72 w-full max-w-lg flex-col items-center justify-center gap-2 rounded bg-white p-10 text-black shadow shadow-black">
        <button
          className="inline-flex w-full items-center justify-center gap-4 rounded-md bg-slate-950 py-2 text-white"
          onClick={() =>
            signIn("google", {
              callbackUrl: callbackUrl
                ? callbackUrl
                : "http://localhost:3000/dashboard",
            })
          }
        >
          <FcGoogle fontSize={24} />
          Continue with Google
        </button>
        <button
          className="inline-flex w-full items-center justify-center gap-4 rounded-md bg-slate-950 py-2 text-white"
          onClick={() =>
            signIn("github", {
              callbackUrl: callbackUrl
                ? callbackUrl
                : "http://localhost:3000/dashboard",
            })
          }
        >
          <AiFillGithub fontSize={24} />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
