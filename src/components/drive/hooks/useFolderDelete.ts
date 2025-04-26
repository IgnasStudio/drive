import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/toast/Toast-provider";
import { deleteFolder } from "~/server/actions";

/**
 * Hook to handle folder deletion logic
 * @param folderName Name of the folder to display in notifications
 * @param folderId ID of the folder to delete
 * @returns Object containing state and handlers for folder deletion
 */
export function useFolderDelete(folderName: string, folderId: number) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
  
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFolder(folderId);
      setIsDeleteModalOpen(false);
      router.refresh();
      addToast({
        variant: "success",
        title: "Folder deleted",
        description: `Folder "${folderName}" and its contents were deleted successfully.`
      });
    } catch (error) {
      setIsDeleteModalOpen(false);
      addToast({
        variant: "error",
        title: "Failed to delete folder",
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