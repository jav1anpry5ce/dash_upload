"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { FaNeos } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const { profileOpen, updateProfileOpen, usage, percentage } =
    useContext(AppContext);

  const variants = {
    close: {
      opacity: 0,
      display: "none",
    },
    open: {
      opacity: 1,
      display: "block",
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!session?.user)
    return (
      <header className="sticky top-0 z-50 backdrop-blur-lg">
        <div className="relative flex items-center justify-between p-2 lg:px-10 lg:py-4">
          <div className="inline-flex items-center gap-2">
            <FaNeos fontSize={24} />
            <p className="font-mono text-xl font-bold">Dash Upload</p>
          </div>
          <button className="" onClick={() => signIn()}>
            Login
          </button>
        </div>
      </header>
    );

  return (
    <header className="sticky top-0 z-[70] backdrop-blur-md">
      <div className="relative flex items-center justify-between p-2 lg:px-10 lg:py-4">
        <Link href="/">
          <div className="inline-flex items-center gap-2">
            <FaNeos fontSize={24} />
            <p className="font-mono text-xl font-bold">Dash Upload</p>
          </div>
        </Link>
        <div>
          <Image
            src={
              session?.user.image
                ? session?.user?.image
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
            }
            alt="profile image"
            width={35}
            height={35}
            className="cursor-pointer rounded-full object-cover"
            onClick={() => updateProfileOpen(!profileOpen)}
          />
        </div>
        <motion.div
          variants={variants}
          initial="close"
          animate={profileOpen ? "open" : "close"}
          className="absolute right-[60px] top-[55px] rounded bg-slate-950 text-white lg:min-w-[300px]"
        >
          <ul>
            <li className="flex items-center gap-4 p-2 px-4">
              <Image
                src={
                  session.user.image
                    ? session?.user?.image
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
                }
                alt="profile image"
                width={35}
                height={35}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{session?.user?.name}</p>
                <p className="text-xs">{session?.user?.email}</p>
              </div>
            </li>
            <li className="space-y-0.5 px-4 pb-2">
              <progress
                className={`${
                  percentage <= 50
                    ? "progress-accent"
                    : percentage >= 75
                    ? "progress-error"
                    : "progress-warning"
                } progress h-1.5 w-full`}
                value={Math.round(percentage)}
                max="100"
              ></progress>
              <p className="text-[11px]">Using {usage} of 2 GB storage</p>
            </li>
            <li className="h-[0.5px] w-full bg-white" />
            <li className="p-2 px-4">
              <button onClick={() => signOut()}>Sign out</button>
            </li>
          </ul>
        </motion.div>
      </div>
    </header>
  );
}
