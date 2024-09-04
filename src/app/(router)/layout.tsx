import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { Toaster as Sonner } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/components/shared/theme-provider";

import { cn, constructMetadata } from "@/lib/utils";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import LocaleSwitch from "@/components/shared/locale-switch";

const SFProExpanded = localFont({
  src: [
    {
      path: "../fonts/SF-Pro-Expanded.ttf",
    },
  ],
});

export const metadata = constructMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  function getTheme() {
    const cookieStore = cookies();
    const themeCookie = cookieStore.get("theme");
    const theme = themeCookie ? themeCookie.value : "dark";
    return theme;
  }
  const theme = getTheme();

  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html
      lang="en"
      className={cn(SFProExpanded.className, theme)}
      style={{ colorScheme: theme }}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          storageKey="theme"
          defaultTheme="light"
          enableSystem
        >
          <TooltipProvider>
            <NextTopLoader
              color="#2299DD"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              template='<div class="bar" role="bar"><div class="peg"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />
            <Sonner position="bottom-center" />
            <TRPCReactProvider>
              <NextIntlClientProvider messages={messages}>
                <LocaleSwitch locale={locale} />
                {children}
              </NextIntlClientProvider>
            </TRPCReactProvider>
            <TailwindIndicator />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
