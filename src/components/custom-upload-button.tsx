"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "./uploadthing";
import styles from "./upload-button.module.css";

interface CustomUploadButtonProps {
  folderId: number;
}

export function CustomUploadButton({ folderId }: CustomUploadButtonProps) {
  const navigate = useRouter();
  
  return (
    <div className={styles.customUploadButton}>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={() => {
          navigate.refresh();
        }}
        input={{ folderId }}
        // We don't need appearance anymore since we're using custom classes
        className="ut-button:rounded-md ut-button:px-4 ut-button:py-2"
      />
    </div>
  );
}