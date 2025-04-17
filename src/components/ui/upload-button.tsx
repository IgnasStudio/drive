"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "../uploadthing";
import styles from "./upload-button.module.css";
import { useToast } from "~/components/ui/toast/toast-provider";

interface UploadButtonProps {
  folderId: number;
}

export function UploadButtonComponent({ folderId }: UploadButtonProps) {
  const navigate = useRouter();
  const { addToast } = useToast();
  
  return (
    <div className={styles.customUploadButton}>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const fileCount = res.length;
            const fileWord = fileCount === 1 ? 'file' : 'files';
            addToast({
              variant: "success",
              title: "Upload complete",
              description: `Successfully uploaded ${fileCount} ${fileWord}.`
            });
          }
          navigate.refresh();
        }}
        onUploadError={(error) => {
          addToast({
            variant: "error",
            title: "Upload failed",
            description: error.message || "An error occurred during upload"
          });
        }}
        input={{ folderId }}
        className="ut-button:rounded-md ut-button:px-4 ut-button:py-2"
      />
    </div>
  );
}