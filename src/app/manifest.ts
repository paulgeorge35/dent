import type { MetadataRoute } from "next";
import { useTheme } from "next-themes";

export default function manifest(): MetadataRoute.Manifest {
  const theme = useTheme();
  const theme_color = theme.resolvedTheme === "light" ? "#000000" : "#020817";
  return {
    name: "MyDent",
    short_name: "MyDent",
    description: "MyDent is a dental practice management software",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
