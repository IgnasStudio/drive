import { FolderIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/Button"
import type { folders_table } from "~/server/db/schema"
import { useFolderDelete } from "../hooks/useFolderDelete"
import { DeleteFolderModal } from "./DeleteFolderModal"

export function FolderRow(props: { folder: typeof folders_table.$inferSelect }) {
  const { folder } = props
  
  // Use custom hook for folder deletion
  const { 
    isDeleteModalOpen, 
    isDeleting, 
    openDeleteModal, 
    closeDeleteModal, 
    handleDelete 
  } = useFolderDelete(folder.name, folder.id)
  
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
            onClick={openDeleteModal}
            aria-label="Delete folder"
            className="hover:text-green-600 hover:bg-green-50 p-1 sm:p-2 h-auto"
          >
            <Trash2Icon size={18} />
          </Button>
        </div>
      </div>
      
      <DeleteFolderModal 
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />
    </li>
  )
}