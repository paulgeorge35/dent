import { env } from "@/env.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function TailwindIndicator() {
  if (env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <Tooltip>
        <TooltipTrigger>
          <div className="block sm:hidden">xs</div>
        </TooltipTrigger>
        <TooltipContent>{"< 640px"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
            sm
          </div>
        </TooltipTrigger>
        <TooltipContent>{"640px - 767px"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">
            md
          </div>
        </TooltipTrigger>
        <TooltipContent>{"768px - 1023px"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
        </TooltipTrigger>
        <TooltipContent>{"1024px - 1279px"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="hidden xl:block 2xl:hidden">xl</div>
        </TooltipTrigger>
        <TooltipContent>{"1280px - 1535px"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="hidden 2xl:block">2xl</div>
        </TooltipTrigger>
        <TooltipContent>{">= 1536px"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
