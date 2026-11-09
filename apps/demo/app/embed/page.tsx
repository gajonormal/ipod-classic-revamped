import EmbedIpod from "./EmbedIpod";

export const dynamic = "force-dynamic";

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ parentOrigin?: string | string[] }>;
}) {
  const { parentOrigin } = await searchParams;
  return (
    <div
      data-ipod-embed=""
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <EmbedIpod
        parentOrigin={
          typeof parentOrigin === "string" ? parentOrigin : undefined
        }
      />
    </div>
  );
}
