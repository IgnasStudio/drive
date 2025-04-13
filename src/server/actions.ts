"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  try {
    const [file] = await db
      .select()
      .from(files_table)
      .where(
        and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
      );

    if (!file) {
      return { error: "File not found" };
    }

    const utapiResult = await utApi.deleteFiles([
      file.url.replace("https://alwhlxyk0i.ufs.sh/f/", ""),
    ]);

    console.log(utapiResult);

    const dbDeleteResult = await db
      .delete(files_table)
      .where(eq(files_table.id, fileId));

    console.log(dbDeleteResult);

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