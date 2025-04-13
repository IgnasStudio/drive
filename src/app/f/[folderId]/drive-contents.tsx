"use client";

import { ChevronRight } from "lucide-react"
import { FileRow, FolderRow } from "./file-row"
import type { files_table, folders_table } from "~/server/db/schema"
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];

  currentFolderId: number;
}) {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/f/1"
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
        <footer className="mt-16 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Ignas Studio Drive
        </footer>
      </div>
    </div>
  )
}

