import { Suspense } from "react";
import { Ipod } from "@/components/ClientIpod";
import samplePlaylist from "../../public/demo-songs.json";

export const dynamic = "force-dynamic";

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ parentOrigin?: string | string[] }>;
}) {
  const { parentOrigin } = await searchParams;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      <Suspense fallback={null}>
        <Ipod
          disableAnimation
          songs={samplePlaylist}
          parentOrigin={
            typeof parentOrigin === "string" ? parentOrigin : undefined
          }
        />
      </Suspense>
    </div>
  );
}
