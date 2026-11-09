import StyledComponentsRegistry from "@/lib/registry";
import { SerwistProvider } from "@/lib/serwist-provider";
import { Metadata, Viewport } from "next";
import "./styles/globals.css";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || undefined;

export const metadata: Metadata = {
  title: "iPod.js",
  description: "An iPod Classic built for the web.",
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "iPod.js",
  },
  openGraph: {
    url: appUrl,
    title: "iPod.js",
    description: "An iPod Classic built for the web.",
    type: "website",
    images: [
      {
        url: "https://user-images.githubusercontent.com/21055469/71636084-6081a800-2be0-11ea-98ee-9599a3396c84.png",
        width: 1200,
        height: 630,
        alt: "iPod.js",
      },
    ],
  },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SerwistProvider swUrl="/sw.js" options={{ scope: "/" }}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </SerwistProvider>
      </body>
    </html>
  );
}
