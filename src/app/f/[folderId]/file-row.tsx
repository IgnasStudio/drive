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
        <li key={file.id} className="px-6 py-4 border-b border-gray-200 hover:bg-gray-100">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center">
              <a href={file.url} target="_blank" className="flex items-center text-gray-800 hover:text-green-600">
                <FileIcon className="mr-3 text-gray-500" size={20} />
                {file.name}
              </a>
          </div>
          <div className="col-span-2 text-gray-500">{"file"}</div>
        <div className="col-span-3 text-gray-500">{formatFileSize(file.size)}</div>
        <div className="col-span-1 text-gray-500">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(true)}
            aria-label="Delete file"
            className="hover:text-green-600 hover:bg-green-50"
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
        </div>
        
        {isDeleteModalOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            role="dialog"
            aria-labelledby="delete-file-title"
            aria-modal="true"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 id="delete-file-title" className="text-lg font-medium mb-4 text-gray-800">Delete File</h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this file? This action cannot be undone.
              </p>
              <div className="flex justify-end">
                <Button
                  ref={cancelButtonRef}
                  onClick={() => setIsDeleteModalOpen(false)}
                  variant="outline"
                  className="mr-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    deleteFile(file.fileKey);
                    setIsDeleteModalOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
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
        <li key={folder.id} className="px-6 py-4 border-b border-gray-200 hover:bg-gray-100">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center">
              <Link
                href={`/f/${folder.id}`}
                className="flex items-center text-gray-800 hover:text-green-600"
              >
                <FolderIcon className="mr-3 text-green-600" size={20} />
                {folder.name}
              </Link>
          </div>
          <div className="col-span-2 text-gray-500">folder</div>
          <div className="col-span-3 text-gray-500"></div>
          <div className="col-span-1 text-gray-500">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="Delete folder"
              className="hover:text-green-600 hover:bg-green-50"
            >
              <Trash2Icon size={20} />
            </Button>
          </div>
        </div>
        
        {isDeleteModalOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            role="dialog"
            aria-labelledby="delete-folder-title"
            aria-modal="true"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 id="delete-folder-title" className="text-lg font-medium mb-4 text-gray-800">Delete Folder</h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this folder? This action will also delete all files and folders inside it and cannot be undone.
              </p>
              <div className="flex justify-end">
                <Button
                  ref={cancelButtonRef}
                  onClick={() => setIsDeleteModalOpen(false)}
                  variant="outline"
                  className="mr-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    deleteFolder(folder.id);
                    setIsDeleteModalOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
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