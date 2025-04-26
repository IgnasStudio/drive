"use client";

import { ChevronRight, FolderPlus, ChevronLeft, Loader2 } from "lucide-react";
import { FileRow } from "../files/FileRow";
import { FolderRow } from "../folders/FolderRow";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/Button";
import { UploadButtonComponent } from "~/components/ui/Upload-button";
import { useFolderCreate } from "../hooks/useFolderCreate";

interface DriveContentsProps {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}

export default function DriveContents({ files, folders, parents, currentFolderId }: DriveContentsProps) {
  const navigate = useRouter();
  
  // Extract folder creation logic into a dedicated hook
  const { 
    isDialogOpen, 
    isCreating, 
    newFolderName, 
    setNewFolderName,
    openDialog, 
    closeDialog, 
    handleCreateFolder 
  } = useFolderCreate(currentFolderId);

  // Find the parent folder for the back button
  // Ensure there is a valid parent folder
  const parentFolder = parents.length > 1 
    ? parents[parents.length - 2] 
    : parents[0] ?? null;
    
  const isRootFolder = parents.length <= 1;
  
  return (
    <div className="text-gray-800 px-4 sm:px-8 py-4 sm:py-8 h-full w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center mb-3 sm:mb-0">
           {/* My Drive will always lead to the first parent, which is the root folder */}
            <Link
              href={`/f/${parents[0]?.id}`}
              className="text-gray-800 hover:text-green-600 mr-2 font-medium"
            >
              My Drive
            </Link>
            {parents?.map((folder, _index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-1 sm:mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-800 hover:text-green-600 font-medium text-sm sm:text-base"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
          <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <div className="mb-4 h-10">
          {!isRootFolder && parentFolder && (
            <Button
              variant="outline"
              className="flex items-center border-gray-300 hover:bg-gray-50 text-sm"
              onClick={() => parentFolder && navigate.push(`/f/${parentFolder.id}`)}
            >
              <ChevronLeft className="mr-1" size={18} />
              <span className="truncate">Back to {parentFolder.name}</span>
            </Button>
          )}
        </div>

        <div className="bg-white bg-opacity-90 rounded-lg shadow-md border border-gray-100">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-500">
              <div className="col-span-6">Name</div>
              <div className="col-span-2 hidden sm:block">Type</div>
              <div className="col-span-4 sm:col-span-3">Size</div>
              <div className="col-span-2 sm:col-span-1">Actions</div>
            </div>
          </div>
          <ul className="rounded-b-lg overflow-hidden">
          {folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <div className="mt-4 sm:mt-6 flex justify-center">
          <UploadButtonComponent folderId={currentFolderId} />
        </div>
        <div className="mt-4 sm:mt-6 flex justify-center">
          <Button 
            onClick={openDialog}
            className="bg-gradient-to-r from-[#22c55e] to-[#059669] hover:from-[#1eb874] hover:to-[#047857] text-white text-sm sm:text-base"
          >
            <FolderPlus className="mr-2" size={16} />
            New Folder
          </Button>
        </div>
        {isDialogOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
            role="dialog"
            aria-labelledby="create-folder-title"
            aria-modal="true"
          >
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 id="create-folder-title" className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-800">Create New Folder</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Folder Name"
                autoFocus
                onKeyDown={async (e) => {
                  if (e.key === "Escape") {
                    closeDialog();
                  } else if (e.key === "Enter" && newFolderName) {
                    await handleCreateFolder();
                  }
                }}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={closeDialog} 
                  variant="outline"
                  className="mr-2 border-gray-300 hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => await handleCreateFolder()} 
                  disabled={!newFolderName || isCreating}
                  className="bg-gradient-to-r from-[#22c55e] to-[#059669] hover:from-[#1eb874] hover:to-[#047857] text-white text-sm sm:text-base"
                >
                  {isCreating ?  <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Creating...
                    </> : "Create"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}