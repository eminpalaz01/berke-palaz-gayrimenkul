"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface ScrollToTopProps {
  ignoreSearch?: boolean;
}

export default function ScrollToTop({ ignoreSearch = true }: ScrollToTopProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  const currentPath = ignoreSearch
    ? pathname
    : `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (lastPath.current !== currentPath) {
      window.scrollTo({ top: 0, behavior: "auto" });
      lastPath.current = currentPath;
    }
  }, [currentPath]);

  return null;
}