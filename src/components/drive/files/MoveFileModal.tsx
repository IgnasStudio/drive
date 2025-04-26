import { useRef } from "react";
import { Button } from "~/components/ui/Button";
import { Loader2, FolderIcon, ChevronRightIcon, FolderTreeIcon } from "lucide-react";
import { useModalEscape } from "../hooks/useModalEscape";
import type { folders_table } from "~/server/db/schema";

interface MoveFileModalProps {
  isOpen: boolean;
  isMoving: boolean;
  isLoadingFolders: boolean;
  fileName: string;
  availableFolders: (typeof folders_table.$inferSelect)[];
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number) => void;
  onClose: () => void;
  onMove: () => Promise<void>;
}

export function MoveFileModal({
  isOpen,
  isMoving,
  isLoadingFolders,
  fileName,
  availableFolders,
  selectedFolderId,
  onSelectFolder,
  onClose,
  onMove
}: MoveFileModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  
  // Use a custom hook for Escape key handling
  useModalEscape(isOpen, onClose, cancelButtonRef);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
      role="dialog"
      aria-labelledby="move-file-title"
      aria-modal="true"
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 id="move-file-title" className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800 flex items-center">
          <FolderTreeIcon className="mr-2" size={20} />
          Move File
        </h2>
        <p className="mb-4 text-sm sm:text-base text-gray-600">
          Select a destination folder for &quot;{fileName}&quot;:
        </p>
        
        <div className="mb-4 max-h-60 overflow-y-auto border rounded-lg p-2">
          {isLoadingFolders ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-green-600" />
              <span>Loading folders...</span>
            </div>
          ) : availableFolders.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              No other folders available.
            </div>
          ) : (
            <ul className="space-y-1">
              {availableFolders.map((folder) => (
                <li key={folder.id}>
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                      selectedFolderId === folder.id 
                        ? 'bg-green-100 text-green-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <FolderIcon className="mr-2 flex-shrink-0 text-green-600" size={16} />
                    <span className="truncate">{folder.name}</span>
                    {selectedFolderId === folder.id && (
                      <ChevronRightIcon className="ml-auto flex-shrink-0 text-green-600" size={16} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button
            ref={cancelButtonRef}
            onClick={onClose}
            variant="outline"
            className="mr-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
            disabled={isMoving}
          >
            Cancel
          </Button>
          <Button
            onClick={onMove}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
            disabled={isMoving || !selectedFolderId || isLoadingFolders}
          >
            {isMoving ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Moving...
              </>
            ) : (
              "Move"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}