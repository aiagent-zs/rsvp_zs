"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function getName() {
  return new URLSearchParams(window.location.search).get("to")?.trim().slice(0, 60) ?? "";
}

/** Nama tamu dari tautan undangan, mis. /?to=Budi%20Santoso. */
export function GuestName({ fallback }: { fallback: string }) {
  const name = useSyncExternalStore(subscribe, getName, () => "");
  return <>{name || fallback}</>;
}
