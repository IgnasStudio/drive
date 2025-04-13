"use client";

import { ChevronRight, FolderPlus } from "lucide-react"
import { FileRow, FolderRow } from "./file-row"
import type { files_table, folders_table } from "~/server/db/schema"
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { createFolder } from "~/server/actions";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];

  currentFolderId: number;
}) {
  const navigate = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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
        <div className="bg-white bg-opacity-90 rounded-lg shadow-md border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
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
          <UploadButton 
            endpoint="imageUploader" 
            onClientUploadComplete={() => {
              navigate.refresh();
            }} 
            input={{ folderId: props.currentFolderId }}
            appearance={{
              button: {
                backgroundColor: "#10b981",
                background: "linear-gradient(to right, #22c55e, #059669)",
              }
            }}
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => setIsDialogOpen(true)}>
            <FolderPlus className="mr-2" size={16} />
            New Folder
          </Button>
        </div>
        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-medium mb-4">Create New Folder</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                placeholder="Folder Name"
              />
              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)} className="mr-2">
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder} disabled={!newFolderName}>
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

