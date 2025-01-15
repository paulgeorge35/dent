import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Trash2, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type Accept, ErrorCode, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Icons } from "../ui/icons";

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

const FileSpecificIcon = (file: File) => {
  const extension = file.name.split(".").pop() ?? "";
  switch (extension) {
    case "pdf":
      return Icons.pdfFile;
    case "doc":
      return Icons.docFile;
    case "docx":
      return Icons.docxFile;
    case "jpg":
    case "jpeg":
      return Icons.jpgFile;
    case "png":
      return Icons.pngFile;
    default:
      return Icons.file;
  }
}
export interface DropzoneFilesProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "accept" | "value" | "onChange"
  > {
  onChange: (
    _value: Array<{
      name: string;
      extension: string;
      contentType: string;
      key: string;
    }>,
  ) => void;
  value?: Array<{
    name: string;
    extension: string;
    contentType: string;
    key: string;
  }>;
  onClear?: () => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  prefix?: string;
  wrapperClassName?: string;
}

export function DropzoneFiles({
  className,
  wrapperClassName,
  maxFiles = 1,
  maxSize = 5,
  accept,
  prefix,
  value,
  onChange,
  ...rest
}: DropzoneFilesProps) {
  const t = useTranslations("fields.files");
  const { mutateAsync: getUploadUrl } =
    api.storage.generateUploadUrl.useMutation();
  const { mutateAsync: updateFile } = api.storage.update.useMutation();
  const { mutateAsync: deleteFile, isPending: isDeleting } =
    api.storage.delete.useMutation();
  const [files, setFiles] = useState<
    Array<{ file: File; progress: number; key?: string; xhr?: XMLHttpRequest }>
  >(
    (value?.map((file) => ({ ...file, progress: 100 })) as unknown as Array<{
      file: File;
      progress: number;
      key?: string;
      xhr?: XMLHttpRequest;
    }>) ?? [],
  );

  const uploadFile = async (file: File, index: number) => {
    const { url, key } = await getUploadUrl({
      key: prefix ? `${prefix}/${uuidv4()}` : uuidv4(),
    });

    const response = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles[index]!.progress = percentComplete;
            return newFiles;
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles[index]!.key = key;
            return newFiles;
          });
          resolve(key);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () =>
        reject(new Error("Upload failed due to a network error"));

      xhr.send(file);

      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index]!.xhr = xhr;
        return newFiles;
      });
    });

    await updateFile({
      key,
      contentType: file.type,
      name: file.name,
      size: file.size,
      extension: file.name.split(".").pop() ?? "",
    });

    return response;
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    const newFiles: Array<{ file: File; progress: number; key?: string }> =
      acceptedFiles.map((file) => ({ file, progress: 0 }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const uploadedFiles = await Promise.all(
      newFiles.map((fileData, index) =>
        uploadFile(fileData.file, files.length + index),
      ),
    );

    const filesData = newFiles.map((fileData, index) => {
      const extension = fileData.file.name.split(".").pop() ?? "";
      const contentType = fileData.file.type;
      const key = uploadedFiles[index]!;
      return {
        name: fileData.file.name,
        extension,
        contentType,
        key,
        size: fileData.file.size,
        file: fileData.file,
      };
    });

    onChange([...(value ?? []), ...filesData]);
  };

  const handleDelete = (key: string) => {
    onChange((value ?? []).filter((file) => file.key !== key));
    setFiles((prevFiles) => prevFiles.filter((file) => file.key !== key));
    void deleteFile({ key });
  };

  const handleCancel = (index: number) => {
    const file = files[index];
    if (file?.xhr) {
      file.xhr.abort();
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept,
    maxFiles,
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

  return (
    <div {...getRootProps()} className={cn("dropzone", wrapperClassName)}>
      <div className={cn("relative flex w-full items-center gap-2", className)}>
        <input
          {...getInputProps({
            ...rest,
          })}
        />
        <Upload />
        {!isDragActive && <p>{t("drag-drop")}</p>}
        {isDragAccept && <p>{t("drop")}</p>}
        {isDragReject && <p>{t("reject")}</p>}
        <Separator orientation="vertical" className="h-8 shrink-0" />
        <Button
          variant="ghost"
          className="!p-0 text-link hover:bg-transparent hover:text-link-hover"
          onClick={(e) => {
            // e.preventDefault();
            getInputProps().onClick?.(
              e as unknown as React.MouseEvent<HTMLInputElement>,
            );
          }}
        >
          {t("browse")}
        </Button>
      </div>
      <div className="horizontal mt-2 w-full items-center justify-between text-xs text-muted-foreground">
        <p>{t("maximum-size", { size: maxSize })}</p>
        <p>
          {value?.length ?? 0} / {maxFiles}
        </p>
      </div>
      <div className="vertical mt-8 gap-4">
        {files.map((fileData, index) => (
          <FileUpload
            key={index}
            file={fileData.file}
            uploadProgress={fileData.progress}
            onDelete={() => handleDelete(fileData.key!)}
            onCancel={() => handleCancel(index)}
            isDeleting={isDeleting}
            isUploading={fileData.progress < 100}
          />
        ))}
      </div>
    </div>
  );
}

const FileUpload = ({
  file,
  uploadProgress,
  onDelete,
  onCancel,
  isDeleting,
  isUploading,
}: {
  file: File;
  uploadProgress: number;
  onDelete: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  isUploading: boolean;
}) => {
  const extension = file.name.split(".").pop() ?? "";
  const t = useTranslations("fields.files");
  return (
    <div className="flex w-full items-start gap-2 text-xs ">
      {extension === 'pdf' && <Icons.pdfFile className="size-10" />}
      {extension === 'doc' && <Icons.docFile className="size-10" />}
      {extension === 'docx' && <Icons.docxFile className="size-10" />}
      {extension === 'png' && <Icons.pngFile className="size-10" />}
      {['jpg', 'jpeg'].includes(extension) && <Icons.jpgFile className="size-10" />}
      <div className="vertical w-full gap-1">
        <span className="horizontal items-center justify-between">
          {file.name}
          <Button
            variant="ghost"
            size="icon"
            className="!size-4 !p-0"
            onClick={(e) => {
              e.stopPropagation();
              isUploading ? onCancel() : onDelete();
            }}
            disabled={isDeleting}
          >
            {isUploading ? (
              <X className="size-4 text-muted-foreground" />
            ) : (
              <Trash2 className="size-4 text-muted-foreground" />
            )}
          </Button>
        </span>
        <Progress
          value={uploadProgress}
          className="h-1"
          indicatorClassName="bg-green-600"
        />
        <span className="horizontal items-center justify-between">
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          <span className="text-muted-foreground">
            {uploadProgress === 100
              ? t("completed")
              : `${uploadProgress.toFixed(0)}%`}
          </span>
        </span>
      </div>
    </div>
  );
};
