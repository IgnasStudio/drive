"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileKey: string) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  try {
    const [file] = await db
      .select()
      .from(files_table)
      .where(
        and(eq(files_table.fileKey, fileKey), eq(files_table.ownerId, session.userId)),
      );

    if (!file) {
      return { error: "File not found" };
    }

    // Delete file from uploadthing
    await utApi.deleteFiles(fileKey);

    // Delete file from database
    await db
      .delete(files_table)
      .where(eq(files_table.fileKey, fileKey));

    // Hack to update the content on the page
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error: "Failed to delete file" };
  }
}

export async function createFolder(name: string, parentId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  try {
    const result = await db
      .insert(folders_table)
      .values({
        name,
        parent: parentId,
        ownerId: session.userId,
      })
      .$returningId();
    
    // Hack to update the content on the page
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));
    
    return { success: true, folderId: result[0]?.id };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { error: "Failed to create folder" };
  }
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  try {
    // Check if folder exists and belongs to current user
    const [folder] = await db
      .select()
      .from(folders_table)
      .where(
        and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId)),
      );

    if (!folder) {
      return { error: "Folder not found" };
    }

    // Function to recursively delete folders and their contents
    async function deleteRecursively(currentFolderId: number) {
      // Get all subfolders in this folder
      const subfolders = await db
        .select()
        .from(folders_table)
        .where(eq(folders_table.parent, currentFolderId));
      
      // Recursively delete each subfolder and its contents
      for (const subfolder of subfolders) {
        await deleteRecursively(subfolder.id);
      }

      // Delete all files in this folder
      const filesToDelete = await db
        .select()
        .from(files_table)
        .where(eq(files_table.parent, currentFolderId));
      
      // Delete files from uploadthing if there are any
      if (filesToDelete.length > 0) {
        const fileKeys = filesToDelete.map(file => 
          file.fileKey
        );
        await utApi.deleteFiles(fileKeys);
      }

      // Delete all files from database
      await db
        .delete(files_table)
        .where(eq(files_table.parent, currentFolderId));
      
      // Delete this folder from database
      await db
        .delete(folders_table)
        .where(eq(folders_table.id, currentFolderId));
    }
    
    // Start the recursive deletion process
    await deleteRecursively(folderId);

    // Hack to update the content on the page
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return { error: "Failed to delete folder" };
  }
}

export async function moveFile(fileId: number, newParentFolderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  try {
    // Check if file exists and belongs to current user
    const [file] = await db
      .select()
      .from(files_table)
      .where(
        and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
      );

    if (!file) {
      return { error: "File not found" };
    }

    // Check if destination folder exists and belongs to current user
    const [folder] = await db
      .select()
      .from(folders_table)
      .where(
        and(eq(folders_table.id, newParentFolderId), eq(folders_table.ownerId, session.userId)),
      );

    if (!folder) {
      return { error: "Destination folder not found" };
    }

    // Update file's parent folder
    await db
      .update(files_table)
      .set({ parent: newParentFolderId })
      .where(eq(files_table.id, fileId));

    // Hack to update the content on the page
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { 
      success: true,
      message: `File "${file.name}" moved successfully.`
    };
  } catch (error) {
    console.error("Error moving file:", error);
    return { error: "Failed to move file" };
  }
}