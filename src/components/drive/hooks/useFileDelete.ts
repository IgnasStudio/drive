import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/toast/Toast-provider";
import { deleteFile } from "~/server/actions";

/**
 * Hook to handle file deletion logic
 * @param fileName Name of the file to display in notifications
 * @param fileKey Unique identifier of the file to delete
 * @returns Object containing state and handlers for file deletion
 */
export function useFileDelete(fileName: string, fileKey: string) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
  
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFile(fileKey);
      setIsDeleteModalOpen(false);
      router.refresh();
      addToast({
        variant: "success",
        title: "File deleted",
        description: `File "${fileName}" was deleted successfully.`
      });
    } catch (error) {
      setIsDeleteModalOpen(false);
      addToast({
        variant: "error",
        title: "Failed to delete file",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    handleDelete
  };
}