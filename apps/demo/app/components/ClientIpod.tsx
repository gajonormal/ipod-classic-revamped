"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  FloatingIpod as RawFloatingIpod,
  Ipod as RawIpod,
  type FloatingIpodProps,
  type IpodProps,
} from "react-ipod-classic";

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}

export function Ipod(props: IpodProps) {
  return (
    <ClientOnly>
      <RawIpod {...props} />
    </ClientOnly>
  );
}

export function FloatingIpod(props: FloatingIpodProps) {
  return (
    <ClientOnly>
      <RawFloatingIpod {...props} />
    </ClientOnly>
  );
}
