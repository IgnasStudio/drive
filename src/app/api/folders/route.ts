import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { folders_table } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { QUERIES } from "~/server/db/queries";

// GET handler to retrieve all folders for the authenticated user
export async function GET() {
  const session = await auth();
  
  // Check if the user is authenticated
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the root folder for the user
    const rootFolder = await QUERIES.getRootFolderForUser(session.userId);
    
    if (!rootFolder) {
      return NextResponse.json({ error: "Root folder not found" }, { status: 404 });
    }

    // Get all folders for the user
    const folders = await db
      .select()
      .from(folders_table)
      .where(eq(folders_table.ownerId, session.userId));

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}