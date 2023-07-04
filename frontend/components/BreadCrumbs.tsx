"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
export default function BreadCrumbs({ links }: { links: string[] }) {
  const currentPath = links.at(-1);
  const pathname = usePathname();
  if (!currentPath) return;
  return (
    <nav>
      <RenderLink links={links} currentPath={currentPath} pathname={pathname} />
    </nav>
  );
}

function RenderLink({
  links,
  currentPath,
  pathname,
}: {
  links: string[];
  currentPath: string;
  pathname: string;
}) {
  const numberOfLinks = links.length;
  if (numberOfLinks >= 15) {
    const first = links.slice(0, 6);
    const last = links.slice(-6);
    // const newList = first.concat(last);
    return (
      <div className="flex w-full items-center gap-1 overflow-hidden p-2 text-lg lg:px-10 [&>*:last-child]:hidden">
        <div className="flex items-center gap-1 [&>*:last-child]:hidden">
          {first.map((link, index) => (
            <React.Fragment key={link}>
              {first.lastIndexOf(currentPath) === index ? (
                <p>
                  {link === "dashboard"
                    ? "Dashboard"
                    : link.replaceAll("%20", " ")}
                </p>
              ) : (
                <Link
                  href={`${pathname.split(`/${link}`)[0]}/${link}`}
                  // href={`${pathname.slice(0, pathname.lastIndexOf(link))}/${link}`}
                  className="text-gray-400/40 hover:text-white hover:underline"
                >
                  {link === "dashboard"
                    ? "Dashboard"
                    : link.replaceAll("%20", " ")}
                </Link>
              )}
              <span>/</span>
            </React.Fragment>
          ))}
        </div>
        <p>...</p>
        {last.map((link, index) => (
          <React.Fragment key={link}>
            {last.lastIndexOf(currentPath) === index ? (
              <p>
                {link === "dashboard"
                  ? "Dashboard"
                  : link.replaceAll("%20", " ")}
              </p>
            ) : (
              <Link
                href={`${pathname.split(`/${link}`)[0]}/${link}`}
                // href={`${pathname.slice(0, pathname.lastIndexOf(link))}/${link}`}
                className="text-gray-400/40 hover:text-white hover:underline"
              >
                {link === "dashboard"
                  ? "Dashboard"
                  : link.replaceAll("%20", " ")}
              </Link>
            )}
            <span>/</span>
          </React.Fragment>
        ))}
      </div>
    );
  }
  return (
    <div className="flex w-full items-center gap-1 overflow-hidden p-2 text-lg lg:px-10 [&>*:last-child]:hidden">
      {links.map((link, index) => (
        <React.Fragment key={link}>
          {links.lastIndexOf(currentPath) === index ? (
            <p>
              {link === "dashboard" ? "Dashboard" : link.replaceAll("%20", " ")}
            </p>
          ) : (
            <Link
              href={`${pathname.split(`/${link}`)[0]}/${link}`}
              // href={`${pathname.slice(0, pathname.lastIndexOf(link))}/${link}`}
              className="text-gray-400/40 hover:text-white hover:underline"
            >
              {link === "dashboard" ? "Dashboard" : link.replaceAll("%20", " ")}
            </Link>
          )}
          <span>/</span>
        </React.Fragment>
      ))}
    </div>
  );
}
