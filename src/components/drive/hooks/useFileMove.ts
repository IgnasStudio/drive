import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/toast/Toast-provider";
import { moveFile } from "~/server/actions";
import type { folders_table } from "~/server/db/schema";

/**
 * Hook to handle file move logic
 * @param fileId ID of the file to move
 * @param fileName Name of the file to display in notifications
 * @param currentFolderId Current parent folder ID
 * @returns Object containing state and handlers for file moving
 */
export function useFileMove(fileId: number, fileName: string, currentFolderId: number) {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [availableFolders, setAvailableFolders] = useState<(typeof folders_table.$inferSelect)[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  
  const router = useRouter();
  const { addToast } = useToast();
  
  const openMoveModal = () => setIsMoveModalOpen(true);
  const closeMoveModal = () => {
    setIsMoveModalOpen(false);
    setSelectedFolderId(null);
  };
  
  // Load available folders when move modal opens
  useEffect(() => {
    if (!isMoveModalOpen) return;
    
    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      setAvailableFolders([]);
      
      try {
        const response = await fetch('/api/folders');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json() as { folders: (typeof folders_table.$inferSelect)[] };
        
        if (data.folders) {
          // Filter out the current folder to avoid moving to the same folder
          setAvailableFolders(data.folders.filter((folder) => 
            folder.id !== currentFolderId
          ));
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
        addToast({
          variant: "error",
          title: "Failed to load folders",
          description: "Could not load the folder list. Please try again."
        });
      } finally {
        setIsLoadingFolders(false);
      }
    };
    
    void fetchFolders();
  }, [isMoveModalOpen, currentFolderId, addToast]);
  
  const handleMove = async () => {
    if (!selectedFolderId) {
      addToast({
        variant: "error",
        title: "No folder selected",
        description: "Please select a destination folder."
      });
      return;
    }
    
    try {
      setIsMoving(true);
      const result = await moveFile(fileId, selectedFolderId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setIsMoveModalOpen(false);
      router.refresh();
      addToast({
        variant: "success",
        title: "File moved",
        description: `File "${fileName}" was moved successfully.`
      });
    } catch (error) {
      addToast({
        variant: "error",
        title: "Failed to move file",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsMoving(false);
      setSelectedFolderId(null);
    }
  };
  
  return {
    isMoveModalOpen,
    isMoving,
    isLoadingFolders,
    availableFolders,
    selectedFolderId,
    setSelectedFolderId,
    openMoveModal,
    closeMoveModal,
    handleMove
  };
}