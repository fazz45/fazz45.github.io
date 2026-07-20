import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fazz45.github.io",
);
const socialImage = new URL("og.png", siteUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Fazil Khan — Robotics, Perception & Autonomy",
  description:
    "Robotics engineer building perception, control, and autonomy systems across medical robotics, mobile manipulation, robot learning, and computer vision.",
  keywords: [
    "Fazil Khan",
    "robotics engineer",
    "robot perception",
    "medical robotics",
    "ROS 2",
    "autonomous systems",
    "computer vision",
  ],
  authors: [{ name: "Fazil Khan" }],
  creator: "Fazil Khan",
  icons: {
    icon: "favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "Fazil Khan — Robotics Engineer",
    description:
      "Perception · Control · Autonomy. Selected robotics projects and engineering experience.",
    siteName: "Fazil Khan",
    url: siteUrl,
    images: [
      {
        url: socialImage,
        width: 1731,
        height: 909,
        alt: "Fazil Khan — Robotics engineer working across perception, control, and autonomy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fazil Khan — Robotics Engineer",
    description:
      "Perception · Control · Autonomy. Selected robotics projects and engineering experience.",
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
