import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/toast/Toast-provider";
import { createFolder } from "~/server/actions";

/**
 * Hook to handle folder creation logic
 * @param folderId ID of the parent folder where new folder will be created
 * @returns Object containing state and handlers for folder creation
 */
export function useFolderCreate(folderId: number) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const router = useRouter();
  const { addToast } = useToast();
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  
  const handleCreateFolder = async () => {
    try {
      setIsCreating(true);
      await createFolder(newFolderName, folderId);
      setIsDialogOpen(false);
      setNewFolderName("");
      router.refresh();
      addToast({
        variant: "success",
        title: "Folder created",
        description: `Folder "${newFolderName}" was created successfully.`
      });
    } catch (error) {
      addToast({
        variant: "error",
        title: "Failed to create folder",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return {
    isDialogOpen,
    isCreating,
    newFolderName,
    setNewFolderName,
    openDialog,
    closeDialog,
    handleCreateFolder
  };
}