"use client";

import { ChevronRight, FolderPlus, ChevronLeft } from "lucide-react"
import { FileRow, FolderRow } from "./file-row"
import type { files_table, folders_table } from "~/server/db/schema"
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createFolder } from "~/server/actions";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { CustomUploadButton } from "~/components/custom-upload-button";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];

  currentFolderId: number;
}) {
  const navigate = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Find the parent folder for the back button
  // Ensure we have a valid parent folder
  const parentFolder = props.parents.length > 1 
    ? props.parents[props.parents.length - 2] 
    : props.parents[0] ?? null;
    
  const isRootFolder = props.parents.length <= 1;
  
  const handleCreateFolder = async () => {
    await createFolder(newFolderName, props.currentFolderId);
    setIsDialogOpen(false);
    setNewFolderName("");
    navigate.refresh();
  };

  return (
    <div className=" text-gray-800 p-8 h-full w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
           {/* My Drive will always lead to the first parent, which is the root folder */}
            <Link
              href={`/f/${props.parents[0]?.id}`}
              className="text-gray-800 hover:text-green-600 mr-2 font-medium"
            >
              My Drive
            </Link>
            {props.parents?.map((folder, _index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-800 hover:text-green-600 font-medium"
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

        {/* Back button container - always maintains its height */}
        <div className="mb-4 h-10">
          {!isRootFolder && parentFolder && (
            <Button
              variant="outline"
              className="flex items-center border-gray-300 hover:bg-gray-50"
              onClick={() => parentFolder && navigate.push(`/f/${parentFolder.id}`)}
            >
              <ChevronLeft className="mr-1" size={18} />
              Back to {parentFolder.name}
            </Button>
          )}
        </div>

        <div className="bg-white bg-opacity-90 rounded-lg shadow-md border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          <ul className="rounded-b-lg overflow-hidden">
          {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-center">
          <CustomUploadButton folderId={props.currentFolderId} />
        </div>
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-[#22c55e] to-[#059669] hover:from-[#1eb874] hover:to-[#047857] text-white"
          >
            <FolderPlus className="mr-2" size={16} />
            New Folder
          </Button>
        </div>
        {isDialogOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            role="dialog"
            aria-labelledby="create-folder-title"
            aria-modal="true"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 id="create-folder-title" className="text-lg font-medium mb-4 text-gray-800">Create New Folder</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Folder Name"
                autoFocus
                onKeyDown={async (e) => {
                  if (e.key === "Escape") {
                    setIsDialogOpen(false);
                  } else if (e.key === "Enter" && newFolderName) {
                    await handleCreateFolder();
                  }
                }}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsDialogOpen(false)} 
                  variant="outline"
                  className="mr-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => await handleCreateFolder()} 
                  disabled={!newFolderName}
                  className="bg-gradient-to-r from-[#22c55e] to-[#059669] hover:from-[#1eb874] hover:to-[#047857] text-white"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

