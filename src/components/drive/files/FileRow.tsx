import { FileIcon, Trash2Icon, MoveIcon } from "lucide-react"
import { Button } from "~/components/ui/Button"
import type { files_table } from "~/server/db/schema"
import { formatFileSize, getReadableFileType } from "~/lib/utils"
import { useFileDelete } from "../hooks/useFileDelete"
import { useFileMove } from "../hooks/useFileMove"
import { DeleteFileModal } from "./DeleteFileModal"
import { MoveFileModal } from "./MoveFileModal"

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props
  
  // Use custom hooks for file operations
  const { 
    isDeleteModalOpen, 
    isDeleting,
    openDeleteModal, 
    closeDeleteModal, 
    handleDelete 
  } = useFileDelete(file.name, file.fileKey)
  
  const {
    isMoveModalOpen,
    isMoving,
    isLoadingFolders,
    availableFolders,
    selectedFolderId,
    setSelectedFolderId,
    openMoveModal,
    closeMoveModal,
    handleMove
  } = useFileMove(file.id, file.name, file.parent)
  
  // Get the file's readable type
  const fileType = file.fileType ? getReadableFileType(file.fileType) : "File"
  
  return (
    <li key={file.id} className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 hover:bg-gray-100">
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
        <div className="col-span-6 flex items-center min-w-0">
          <a href={file.url} target="_blank" className="flex items-center text-gray-800 hover:text-green-600 truncate">
            <FileIcon className="mr-2 sm:mr-3 flex-shrink-0 text-gray-500" size={18} />
            <span className="truncate text-sm sm:text-base">{file.name}</span>
          </a>
        </div>
        <div className="col-span-2 text-gray-500 text-xs sm:text-sm hidden sm:block">{fileType}</div>
        <div className="col-span-4 sm:col-span-3 text-gray-500 text-xs sm:text-sm">{formatFileSize(file.size)}</div>
        <div className="col-span-2 sm:col-span-1 text-gray-500 flex justify-end sm:justify-start space-x-1">
          <Button
            variant="ghost"
            onClick={openMoveModal}
            aria-label="Move file"
            className="hover:text-green-600 hover:bg-green-50 p-1 sm:p-2 h-auto"
          >
            <MoveIcon size={18} />
          </Button>
          <Button
            variant="ghost"
            onClick={openDeleteModal}
            aria-label="Delete file"
            className="hover:text-green-600 hover:bg-green-50 p-1 sm:p-2 h-auto"
          >
            <Trash2Icon size={18} />
          </Button>
        </div>
      </div>
      
      <DeleteFileModal 
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />
      
      <MoveFileModal
        isOpen={isMoveModalOpen}
        isMoving={isMoving}
        isLoadingFolders={isLoadingFolders}
        fileName={file.name}
        availableFolders={availableFolders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onClose={closeMoveModal}
        onMove={handleMove}
      />
    </li>
  )
}