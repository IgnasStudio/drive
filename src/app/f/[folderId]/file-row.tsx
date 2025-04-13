import { FolderIcon, FileIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { deleteFile, deleteFolder } from "~/server/actions"
import type { files_table, folders_table } from "~/server/db/schema"

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
    const { file } = props
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
        <div className="col-span-3 text-gray-500">{file.size}</div>
        <div className="col-span-1 text-gray-500">
          <Button
            variant="ghost"
            onClick={() => deleteFile(file.id)}
            aria-label="Delete file"
            className="hover:text-green-600 hover:bg-green-50"
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
        </div>
      </li>
    )
}

export function FolderRow(props: { folder: typeof folders_table.$inferSelect}) {
    const { folder } = props
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
              onClick={() => deleteFolder(folder.id)}
              aria-label="Delete folder"
              className="hover:text-green-600 hover:bg-green-50"
            >
              <Trash2Icon size={20} />
            </Button>
          </div>
        </div>
      </li>
    )
}