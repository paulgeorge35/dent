import { Trash2, Upload, UploadIcon } from "lucide-react";
import Image from "next/image";
import { type Accept, ErrorCode, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { cn, fileToBase64 } from "@/lib/utils";
import type { Avatar } from "@/types/schema";

const handlerFileUploadError = (error?: ErrorCode) => {
  switch (error) {
    case ErrorCode.FileInvalidType:
      return "Invalid file type";
    case ErrorCode.FileTooLarge:
      return "File is too large";
    case ErrorCode.TooManyFiles:
      return "Too many files";
    default:
      return "An error occurred";
  }
};

export interface DropzoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "accept" | "value" | "onChange"
  > {
  onChange: (_value: Avatar) => void;
  value?: Avatar;
  onClear?: () => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
}

export default function DropzoneInput({
  accept = { "image/*": [".jpeg", ".png"] },
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  value,
  onClear,
  onChange,
  ...rest
}: DropzoneInputProps) {
  const [fileInfo, setFileInfo] = useState<{
    extension: string;
    contentType: string;
  } | null>(null);

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
    isFileDialogActive,
    acceptedFiles,
  } = useDropzone({
    multiple: maxFiles > 1,
    onDropRejected: (rejectedFiles) =>
      toast.error("Something went wrong", {
        description: handlerFileUploadError(
          rejectedFiles[0]?.errors[0]?.code as ErrorCode | undefined,
        ),
      }),
    onDrop: (acceptedFiles: File[]) => {
      if (maxFiles === 1) {
        const file = acceptedFiles[0];
        if (!file) return;
        const extension = file.name.split(".").pop() ?? "";
        const contentType = file.type;
        setFileInfo({ extension, contentType });
        void fileToBase64(file).then((base64) =>
          onChange({ extension, contentType, base64 }),
        );
        return;
      }
    },
    accept,
    maxFiles,
    maxSize,
  });

  if (maxFiles === 1 && value)
    return (
      <div
        {...getRootProps({
          className: "border-none bg-transparent p-4",
        })}
      >
        <input
          {...getInputProps({
            ...rest,
          })}
        />

        <div className="flex flex-col items-center justify-center">
          <div className=" flex flex-col items-center justify-center gap-4">
            <Image
              alt="Profile"
              src={typeof value === "string" ? value : value.base64}
              height={200}
              width={200}
              style={{ objectFit: "cover" }}
              className="aspect-square rounded-sm bg-cover bg-center"
            />
            {fileInfo && (
              <p className="text-xs text-muted-foreground">
                {fileInfo.extension.toUpperCase()} - {fileInfo.contentType}
              </p>
            )}
            <Button
              variant="expandIcon"
              Icon={Trash2}
              iconPlacement="right"
              onClick={(e) => {
                e.stopPropagation();
                if (onClear) onClear();
                else onChange(null);
                setFileInfo(null);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      {...getRootProps({
        className: cn(
          "flex flex-col items-center justify-center gap-4 items-center p-6 rounded-lg border border-dashed border-primary transition-border duration-300 ease-in-out outline-none cursor-pointer",
          isDragActive && "bg-blue-500/10",
          isDragAccept && "bg-green-500/20",
          isDragReject && "bg-red-500/20",
          isFileDialogActive && "bg-blue-500/10",
          acceptedFiles.length > 0 && "border-none bg-transparent p-4",
        ),
      })}
    >
      <input
        {...getInputProps({
          ...rest,
        })}
      />
      <Upload />
      {!isDragActive && (
        <span>
          <p className="text-center text-sm font-bold">
            Drag and drop your file here
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Images up to 5MB
          </p>
        </span>
      )}
      {isDragAccept && (
        <span>
          <p className="text-center text-sm font-bold">
            Drop it like it&apos;s hot!
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Images up to 5MB
          </p>
        </span>
      )}
      {isDragReject && (
        <span>
          <p className="text-center text-sm font-bold">
            File type not accepted, sorry!
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Images up to 5MB
          </p>
        </span>
      )}
      <Button
        variant="expandIcon"
        Icon={UploadIcon}
        iconPlacement="right"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Choose File
      </Button>
    </div>
  );
}
