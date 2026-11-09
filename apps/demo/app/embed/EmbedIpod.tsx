"use client";

import { useEffect, useState } from "react";
import { parseIpodSongs, type IpodSong } from "react-ipod-classic";
import { Ipod } from "@/components/ClientIpod";
import samplePlaylist from "../../public/demo-songs.json";

export default function EmbedIpod({ parentOrigin }: { parentOrigin?: string }) {
  const [songs, setSongs] = useState<IpodSong[] | null>();

  useEffect(() => {
    function readPlaylist() {
      const value = new URLSearchParams(window.location.hash.slice(1)).get(
        "playlist"
      );
      try {
        setSongs(
          value === null
            ? samplePlaylist
            : (parseIpodSongs(JSON.parse(value)) ?? null)
        );
      } catch {
        setSongs(null);
      }
    }

    readPlaylist();
    window.addEventListener("hashchange", readPlaylist);
    return () => window.removeEventListener("hashchange", readPlaylist);
  }, []);

  if (songs === undefined) return null;
  if (songs === null) {
    return <p role="alert">The iPod playlist could not be loaded.</p>;
  }

  return (
    <Ipod
      key={JSON.stringify(songs)}
      disableAnimation
      songs={songs}
      parentOrigin={parentOrigin}
    />
  );
}
