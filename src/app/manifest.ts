import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyDent",
    short_name: "MyDent",
    description: "MyDent is a dental practice management software",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
}