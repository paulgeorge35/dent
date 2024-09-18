import { highlightText } from "@/lib/highlighter";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Patient } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBoolean, useStateful } from "react-hanger";
import { useHotkeys } from "react-hotkeys-hook";
import AvatarComponent from "../shared/avatar-component";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CONTROL_KEY, ShortcutKeys } from "../ui/shortcut-key";
import { Skeleton } from "../ui/skeleton";

export default function GlobalSearch() {
  const t = useTranslations("layout.sidebar");
  const globalSearch = useBoolean(false);
  const search = useStateful<string>("");
  const inputRef = useRef<HTMLInputElement>(null!);

  const {
    data: patients,
    refetch: refetchPatients,
    isLoading: isLoadingPatients,
  } = api.patient.list.useQuery(
    {
      search: search.value.trim(),
      page: 1,
      per_page: 10,
    },
    {
      enabled: false,
    },
  );

  const isLoading = useMemo(() => {
    return isLoadingPatients;
  }, [isLoadingPatients]);

  const isData = useMemo(() => {
    return patients?.content.length;
  }, [patients]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  useHotkeys("ctrl+/", () => {
    globalSearch.setTrue();
  });

  useHotkeys("escape", () => {
    globalSearch.setFalse();
  });

  useHotkeys("down", (e) => {
    e.preventDefault();
    setSelectedIndex((prev) =>
      Math.min(prev + 1, (patients?.content.length || 0) - 1),
    );
  });

  useHotkeys("up", (e) => {
    e.preventDefault();
    setSelectedIndex((prev) => Math.max(prev - 1, -1));
  });

  useHotkeys("enter", () => {
    if (selectedIndex >= 0 && patients?.content[selectedIndex]) {
      window.location.href = `/patient/${patients.content[selectedIndex].id}`;
      globalSearch.setFalse();
    }
  });

  useEffect(() => {
    setSelectedIndex(-1);
  }, [search.value]);

  useEffect(() => {
    if (selectedIndex < 0) {
      inputRef.current?.focus();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (search.value.trim().length > 2) {
      refetchPatients();
    }
  }, [search.value, refetchPatients]);

  useEffect(() => {
    search.setValue("");
    if (globalSearch.value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [globalSearch.value]);

  return (
    <>
      <Button
        onClick={globalSearch.setTrue}
        className="rounded-full bg-muted h-10 w-80 text-muted-foreground text-base justify-start font-normal gap-2 border border-input shadow-sm hover:bg-background/50"
      >
        <Search className="size-4 shrink-0" />
        <p className="truncate">{t("search.placeholder")}</p>
        <span className="ml-auto flex items-center gap-1 shrink-0">
          <ShortcutKeys shortcut={CONTROL_KEY} />
          <ShortcutKeys shortcut="/" />
        </span>
      </Button>

      <AnimatePresence>
        {globalSearch.value && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 horizontal center z-[9999]" // Increase z-index significantly
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 dark:bg-white/20 backdrop-blur-sm"
              onClick={globalSearch.setFalse}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "bg-background/90 backdrop-blur-sm rounded-lg shadow-xl z-[10000] w-full max-w-3xl rounded-t-[32px] vertical p-2",
                {
                  "rounded-b-[32px]": !isData && !isLoading,
                },
              )}
            >
              <Input
                ref={inputRef}
                loading={isLoading}
                placeholder={t("search.placeholder")}
                searchClassName="flex-grow rounded-3xl bg-transparent bg-background"
                autoFocus
                search
                value={search.value}
                onChange={(e) => {
                  search.setValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    globalSearch.setFalse();
                  }
                  if (e.key === "Enter" && selectedIndex === -1) {
                    e.preventDefault();
                  }
                  if (e.key === "ArrowDown" && patients?.content.length) {
                    e.preventDefault();
                    setSelectedIndex(0);
                    inputRef.current.blur();
                  }
                }}
              />
              {isLoading && (
                <span className="grid gap-2 max-h-[500px] overflow-y-auto pt-2">
                  <Skeleton className="w-40 rounded-full h-[30px]" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </span>
              )}
              <PatientSearchResults
                patients={patients?.content ?? []}
                search={search.value.trim()}
                onClose={globalSearch.setFalse}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const PatientSearchResults = ({
  patients,
  search,
  onClose,
  selectedIndex,
  setSelectedIndex,
}: {
  patients: Patient[];
  search: string;
  onClose: () => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) => {
  if (patients.length === 0) {
    return null;
  }

  return (
    <span className="grid gap-2 max-h-[500px] overflow-y-auto pt-2">
      <span className="text-sm text-muted-foreground bg-muted rounded-full px-2 py-1 w-fit border border-border">
        Patients - {patients.length} result(s)
      </span>
      {patients.map((patient, index) => (
        <Link
          tabIndex={index}
          href={`/patient/${patient.id}`}
          onClick={onClose}
          key={patient.id}
          className={`p-2 rounded-md bg-background border border-border horizontal center-v gap-2 hover:bg-background/50 hover:border-primary transition-colors duration-200 h-12 ${
            index === selectedIndex
              ? "bg-background/50 shadow-lg border border-primary"
              : ""
          }`}
          onMouseEnter={() => setSelectedIndex(-1)}
        >
          <AvatarComponent
            src=""
            fallback={`${patient.firstName[0]}${patient.lastName[0]}`}
            alt={`${patient.firstName} ${patient.lastName}`}
            randomColor
          />
          {highlightText(
            `${patient.firstName} ${patient.lastName} • ${patient.email} • ${patient.phone}`,
            search,
          )}
        </Link>
      ))}
    </span>
  );
};
