import { Suspense } from "react";
import { Ipod } from "@/components/Ipod";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense>
      <Ipod showReflection={true} />
    </Suspense>
  );
}
