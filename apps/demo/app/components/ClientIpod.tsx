"use client";
import React, { useEffect, useState } from "react";
import {
  FloatingIpod as RawFloatingIpod,
  Ipod as RawIpod,
  FloatingIpodProps,
  IpodProps,
} from "react-ipod-classic";

export const FloatingIpod: React.FC<FloatingIpodProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <RawFloatingIpod {...props} />;
};

export const Ipod: React.FC<IpodProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <RawIpod {...props} />;
};

