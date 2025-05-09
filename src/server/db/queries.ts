import "server-only";

import { db } from "~/server/db";
import {
  files_table as fileSchema,
  folders_table as folderSchema,
} from "~/server/db/schema";
import { eq, isNull, and } from "drizzle-orm";

export const QUERIES = {
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;

    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(folderSchema)
        .where(eq(folderSchema.id, currentId));
      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }

    return parents;
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.id, folderId));
    return folder[0];
  },
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.parent, folderId)).orderBy(folderSchema.id);
  },
  getFiles: function (folderId: number) {
    return db.select().from(fileSchema).where(eq(fileSchema.parent, folderId)).orderBy(fileSchema.id);
  },
  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(folderSchema)
      .where(
        and(eq(folderSchema.ownerId, userId), isNull(folderSchema.parent)),
      );
    return folder[0];
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
      fileKey: string; 
      fileType: string;
    };
    userId: string;
  }) {
   return await db.insert(fileSchema).values({...input.file, ownerId: input.userId});
  },
  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(folderSchema)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(folderSchema).values([
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
}
