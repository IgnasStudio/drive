import { useRef } from "react";
import { Button } from "~/components/ui/Button";
import { Loader2 } from "lucide-react";
import { useModalEscape } from "../hooks/useModalEscape";

interface DeleteFileModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteFileModal({ isOpen, isDeleting, onClose, onDelete }: DeleteFileModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  
  // Use a custom hook for Escape key handling
  useModalEscape(isOpen, onClose, cancelButtonRef);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
      role="dialog"
      aria-labelledby="delete-file-title"
      aria-modal="true"
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 id="delete-file-title" className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800">Delete File</h2>
        <p className="mb-4 text-sm sm:text-base text-gray-600">
          Are you sure you want to delete this file? This action cannot be undone.
        </p>
        <div className="flex justify-end">
          <Button
            ref={cancelButtonRef}
            onClick={onClose}
            variant="outline"
            className="mr-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}