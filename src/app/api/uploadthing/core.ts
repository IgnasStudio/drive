import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {

  fileUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    text: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
    audio: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    blob: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    }
  }).input(z.object({
    folderId: z.number(),
  }),
)
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      const user = await auth();

      if (!user.userId) throw new Error("Unauthorized");
      const folder = await QUERIES.getFolderById(input.folderId);
      if (!folder) throw new Error("Folder not found");

      if(folder.ownerId !== user.userId) {
        throw new Error("Unauthorized");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("metadata", metadata);
      console.log("file", file);
      console.log("file url", file.ufsUrl);
      
      // Extract file extension from file name
      const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
      
      await MUTATIONS.createFile({
        file: {
            name: file.name,
            size: file.size,
            url: file.ufsUrl,
            parent: metadata.parentId, 
            fileKey: file.key, // This is the key that Uploadthing uses to identify the file
            fileType: fileExtension,
            },
            userId: metadata.userId,
        });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
