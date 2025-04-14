import { FolderIcon, FileIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { deleteFile, deleteFolder } from "~/server/actions"
import type { files_table, folders_table } from "~/server/db/schema"
import { formatFileSize } from "~/lib/utils"
import { useEffect, useRef, useState } from "react"

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
    const { file } = props
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const cancelButtonRef = useRef<HTMLButtonElement>(null)
    
    // Handle ESC key press to close modal
    useEffect(() => {
        if (!isDeleteModalOpen) return
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsDeleteModalOpen(false)
            }
        }
        
        window.addEventListener("keydown", handleKeyDown)
        
        // Focus on cancel button when modal opens
        if (cancelButtonRef.current) {
            cancelButtonRef.current.focus()
        }
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isDeleteModalOpen])
    
    return (
        <li key={file.id} className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 hover:bg-gray-100">
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
          <div className="col-span-6 flex items-center min-w-0">
              <a href={file.url} target="_blank" className="flex items-center text-gray-800 hover:text-green-600 truncate">
                <FileIcon className="mr-2 sm:mr-3 flex-shrink-0 text-gray-500" size={18} />
                <span className="truncate text-sm sm:text-base">{file.name}</span>
              </a>
          </div>
          <div className="col-span-2 text-gray-500 text-xs sm:text-sm hidden sm:block">{"file"}</div>
          <div className="col-span-4 sm:col-span-3 text-gray-500 text-xs sm:text-sm">{formatFileSize(file.size)}</div>
          <div className="col-span-2 sm:col-span-1 text-gray-500 flex justify-end sm:justify-start">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="Delete file"
              className="hover:text-green-600 hover:bg-green-50 p-1 sm:p-2 h-auto"
            >
              <Trash2Icon size={18} />
            </Button>
          </div>
        </div>
        
        {isDeleteModalOpen && (
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
                  onClick={() => setIsDeleteModalOpen(false)}
                  variant="outline"
                  className="mr-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await deleteFile(file.fileKey);
                    setIsDeleteModalOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </li>
    )
}

export function FolderRow(props: { folder: typeof folders_table.$inferSelect}) {
    const { folder } = props
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const cancelButtonRef = useRef<HTMLButtonElement>(null)
    
    // Handle ESC key press to close modal
    useEffect(() => {
        if (!isDeleteModalOpen) return
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsDeleteModalOpen(false)
            }
        }
        
        window.addEventListener("keydown", handleKeyDown)
        
        // Focus on cancel button when modal opens
        if (cancelButtonRef.current) {
            cancelButtonRef.current.focus()
        }
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isDeleteModalOpen])
    
    return (
        <li key={folder.id} className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 hover:bg-gray-100">
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
          <div className="col-span-6 flex items-center min-w-0">
              <Link
                href={`/f/${folder.id}`}
                className="flex items-center text-gray-800 hover:text-green-600 truncate"
              >
                <FolderIcon className="mr-2 sm:mr-3 flex-shrink-0 text-green-600" size={18} />
                <span className="truncate text-sm sm:text-base">{folder.name}</span>
              </Link>
          </div>
          <div className="col-span-2 text-gray-500 text-xs sm:text-sm hidden sm:block">folder</div>
          <div className="col-span-4 sm:col-span-3 text-gray-500 text-xs sm:text-sm"></div>
          <div className="col-span-2 sm:col-span-1 text-gray-500 flex justify-end sm:justify-start">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="Delete folder"
              className="hover:text-green-600 hover:bg-green-50 p-1 sm:p-2 h-auto"
            >
              <Trash2Icon size={18} />
            </Button>
          </div>
        </div>
        
        {isDeleteModalOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
            role="dialog"
            aria-labelledby="delete-folder-title"
            aria-modal="true"
          >
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 id="delete-folder-title" className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800">Delete Folder</h2>
              <p className="mb-4 text-sm sm:text-base text-gray-600">
                Are you sure you want to delete this folder? This action will also delete all files and folders inside it and cannot be undone.
              </p>
              <div className="flex justify-end">
                <Button
                  ref={cancelButtonRef}
                  onClick={() => setIsDeleteModalOpen(false)}
                  variant="outline"
                  className="mr-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await deleteFolder(folder.id);
                    setIsDeleteModalOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </li>
    )
}