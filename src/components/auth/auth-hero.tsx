"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import background from "../../../public/background.avif";
import { Box } from "lucide-react";

export default function AuthHero() {
  return (
    <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
      <motion.span
        className="absolute inset-8 overflow-hidden rounded-3xl z-10"
        animate={{
          width: "calc(100% - 64px)",
          borderRadius: "1.5rem",
          inset: "32px"
        }}
        transition={{
          type: "spring",
          duration: 0.8,
          delay: 0.15   ,
        }}
        initial={{
          width: "100vw",
          borderRadius: 0,
          inset: 0,
        }}
      >
        <Image
          src={background}
          alt="Login background"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={background.blurDataURL}
        />
      </motion.span>
      <motion.div
        className="relative z-20 flex items-center p-4 font-mono text-lg font-medium text-primary"
        animate={{
          opacity: 1,
        }}
        transition={{
          type: "spring",
          duration: 0.5,
          delay: 0.95,
        }}
        initial={{
          opacity: 0,
        }}
      >
        <Box className="mr-2" />
        MyDent
      </motion.div>
    </div>
  );
}
