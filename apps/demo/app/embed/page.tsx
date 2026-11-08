import { Suspense } from "react";
import { Ipod } from "@/components/Ipod";

export const dynamic = "force-dynamic";

export default function EmbedPage() {
  return (
    <div 
      style={{ 
        width: "100vw", 
        height: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "transparent",
        overflow: "hidden"
      }}
    >
      <Suspense fallback={null}>
        <Ipod showReflection={false} disableAnimation={true} />
      </Suspense>
    </div>
  );
}
