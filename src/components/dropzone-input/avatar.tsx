import { ErrorCode, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import AvatarComponent from "../shared/avatar-component";

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

export interface AvatarUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "accept" | "value" | "onChange"
  > {
  onChange: (_value: string | null) => void;
  value: string | null;
  onClear?: () => void;
  maxSize?: number;
  type: "avatar" | "clinic-logo";
  fallback?: string;
  fixedColor?: boolean;
}

export function AvatarUpload({
  className,
  maxSize = 5,
  value,
  type = "avatar",
  fallback = "Avatar",
  fixedColor,
  onChange,
  ...rest
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { data: avatar, isLoading: isFetching } = api.storage.avatar.useQuery(
    {
      id: value,
    },
    {
      enabled: !!value,
    },
  );
  const { mutateAsync: getUploadUrl } =
    api.storage.generateAvatarUploadUrl.useMutation();

  const uploadFile = async (file?: File) => {
    setIsUploading(true);
    if (!file) return;
    const { id, url } = await getUploadUrl({
      key: uuidv4(),
      type,
    });

    const response = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(id);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () =>
        reject(new Error("Upload failed due to a network error"));

      xhr.send(file);
    });

    return response;
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    await uploadFile(acceptedFiles[0])
      .then((fileId) => {
        if (fileId) onChange(fileId);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleDelete = () => {
    onChange(null);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/jpg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: maxSize * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      void handleDrop(acceptedFiles);
    },
    onDropRejected: (rejectedFiles) =>
      toast.error("Something went wrong", {
        description: handlerFileUploadError(
          rejectedFiles[0]?.errors[0]?.code as ErrorCode | undefined,
        ),
      }),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn("dropzone", className, {
          "rounded-lg border-[2px] border-dashed": isDragActive,
          "border-blue-400": isDragAccept,
          "border-red-400": isDragReject,
        })}
      >
        <input
          {...getInputProps({
            ...rest,
          })}
          ref={inputRef}
        />
        <AvatarComponent
          src={avatar?.url}
          alt="Avatar"
          fallback={fallback === "" ? "Avatar" : fallback}
          width={100}
          height={100}
          className="aspect-square size-[100px] bg-cover bg-center text-2xl"
          isLoading={isUploading || isFetching}
          fixedColor={fixedColor}
        />
        <Separator orientation="vertical" className="h-8 shrink-0" />
        <Button
          variant="ghost"
          className={cn(
            "!p-0 text-link hover:bg-transparent hover:text-link-hover",
          )}
          onClick={(e) => {
            e.preventDefault();
            if (!value) {
              inputRef.current?.click();
              return;
            }
            e.stopPropagation();
            handleDelete();
          }}
        >
          {value ? "Remove" : "Browse"}
        </Button>
      </div>
      <div
        className={cn(
          "horizontal mt-2 w-full items-center justify-between text-xs text-muted-foreground",
        )}
      >
        <p>Maximum upload file size: {maxSize}MB</p>
      </div>
    </div>
  );
}
