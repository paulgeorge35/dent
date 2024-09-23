"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn, generateRandomTailwindColor } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import AvatarComponent from "../shared/avatar-component";
import {
  Credenza,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "../ui/credenza";
import { Separator } from "../ui/separator";

type AvatarInputProps = {
  id?: string;
  fallback?: string;
  onChange: (value: string | null) => void;
  value: string | null;
  type?: "avatar" | "clinic-logo";
  maxSize?: number;
};

const AvatarInput = forwardRef<HTMLInputElement, AvatarInputProps>(
  ({ id, fallback, onChange, value, type = "avatar", maxSize = 5 }, ref) => {
    const t = useTranslations("fields");
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [randomBgColor, setRandomBgColor] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    useEffect(() => {
      setRandomBgColor(generateRandomTailwindColor(fallback?.length ?? 0));
    }, [fallback]);

    const resizeImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > 400) {
                height *= 400 / width;
                width = 400;
              }
            } else {
              if (height > 400) {
                width *= 400 / height;
                height = 400;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/png"));
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]!;
        try {
          const resizedImage = await resizeImage(file);
          setImage(resizedImage);
          setIsDialogOpen(true);
        } catch (error) {
          console.error("Error resizing image:", error);
        }
      }
    };

    const handleBrowseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      fileInputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onChange(null);
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setRandomBgColor(generateRandomTailwindColor(fallback?.length ?? 0));
    };

    const onCropComplete = useCallback(
      (_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
      },
      [],
    );

    const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<File> => {
      const image = document.createElement("img");
      image.src = imageSrc;
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return Promise.reject(new Error("No 2d context"));
      }

      return new Promise((resolve, reject) => {
        image.onload = () => {
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;
          ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            200,
            200,
          );

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            resolve(new File([blob], "cropped-image.png", { type: "image/png" }));
          }, "image/png");
        };
        image.onerror = () => reject(new Error("Error loading image"));
      });
    };

    const fallbackCrop = (imageSrc: string, pixelCrop: Area): Promise<File> => {
      const image = document.createElement("img");
      image.src = imageSrc;
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return Promise.reject(new Error("No 2d context"));
      }

      return new Promise((resolve, reject) => {
        image.onload = () => {
          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
          );

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            resolve(new File([blob], "cropped-image.png", { type: "image/png" }));
          }, "image/png");
        };
        image.onerror = () => reject(new Error("Error loading image"));
      });
    };

    const cropAndUpload = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        try {
          if (image && croppedAreaPixels) {
            const getCroppedImage = async () => {
              try {
                return await getCroppedImg(image, croppedAreaPixels);
              } catch (error) {
                console.warn(
                  "Primary crop method failed, trying fallback...",
                  error,
                );
                return await fallbackCrop(image, croppedAreaPixels);
              }
            };

            await uploadFile(await getCroppedImage())
              .then((fileId) => {
                if (fileId) onChange(fileId);
              })
              .finally(() => {
                setIsUploading(false);
              });

            setIsDialogOpen(false);
          } else {
            throw new Error("Missing image or crop data");
          }
        } catch (e) {
          console.error("Error cropping image:", e);
        } finally {
          setIsLoading(false);
        }
      },
      [croppedAreaPixels, image],
    );

    const handleDrop = async (acceptedFiles: File[]) => {
      try {
        if (!acceptedFiles[0]) {
          return;
        }
        const resizedImage = await resizeImage(acceptedFiles[0]);
        setImage(resizedImage);
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    };

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

    const uploadFile = async (file: File) => {
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
        "image/svg+xml": [".svg"],
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

    return (
      <>
        <Credenza open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <CredenzaContent className="sm:max-w-[425px]">
            <CredenzaHeader>
              <CredenzaTitle>{t("avatar.crop")}</CredenzaTitle>
            </CredenzaHeader>
            {image && (
              <div className="relative w-64 h-64 mx-auto">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid={false}
                />
              </div>
            )}
            {image && (
              <div className="w-64 mx-auto">
                <Slider
                  min={1}
                  max={2}
                  step={0.1}
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0] ?? 1)}
                />
              </div>
            )}
            <CredenzaFooter>
              <Button onClick={cropAndUpload} disabled={isLoading}>
                {isLoading ? t("avatar.processing") : t("avatar.confirm")}
              </Button>
            </CredenzaFooter>
          </CredenzaContent>
        </Credenza>
        <div>
          <div
            {...getRootProps()}
            className={cn("dropzone horizontal center gap-4", {
              "rounded-lg border-[2px] border-dashed": isDragActive,
              "border-blue-400": isDragAccept,
              "border-red-400": isDragReject,
            })}
          >
            <input
              id={id}
              ref={ref} // Use the forwarded ref here
              type="file"
              onChange={onFileChange}
              className="sr-only"
              aria-label="Choose an image to crop"
              {...getInputProps()}
            />
            <div className="relative">
              <AvatarComponent
                src={avatar?.url}
                alt={fallback ?? "Avatar"}
                fallback={fallback === "" ? "Avatar" : fallback ?? "Avatar"}
                width={200}
                height={200}
                className={cn(
                  "aspect-square size-[100px] bg-cover bg-center text-2xl",
                  randomBgColor,
                )}
                isLoading={isUploading || isFetching}
                randomColor
              />
              <button
                type="button"
                className="absolute top-0 left-0 size-[100px] opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full flex items-center justify-center text-white border-0 border-blue-500 hover:border-4 border-dashed"
                onClick={handleBrowseClick}
              >
                <Upload />
              </button>
            </div>
            <Separator orientation="vertical" className="h-8 shrink-0" />
            {value && (
              <Button
                type="button"
                variant="link"
                className="text-link hover:text-link-hover !px-0"
                onClick={handleRemoveImage}
              >
                {t("avatar.remove")}
              </Button>
            )}
            {!value && (
              <Button
                type="button"
                variant="link"
                className="text-link hover:text-link-hover !px-0"
                onClick={handleBrowseClick}
              >
                {t("avatar.browse")}
              </Button>
            )}
          </div>
          <div
            className={cn(
              "horizontal mt-2 w-full items-center justify-between text-xs text-muted-foreground",
            )}
          >
            <p>{t("avatar.limit", { size: maxSize })}</p>
          </div>
        </div>
      </>
    );
  }
);

AvatarInput.displayName = "AvatarInput"; // Add a display name for better debugging

export default AvatarInput;

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}
