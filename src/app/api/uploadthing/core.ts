import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {

  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
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

      console.log("file url", file.ufsUrl);
      await MUTATIONS.createFile({
        file: {
            name: file.name,
            size: file.size,
            url: file.ufsUrl,
            parent: metadata.parentId, 
            },
            userId: metadata.userId,
        });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
