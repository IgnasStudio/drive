import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccessDenied from "~/components/access-denied";

export default async function GoogleDriveClone(props: { params: Promise<{ folderId: string }> }) {
    const params = await props.params;
    const session = await auth();
    
    // Redirect to sign-in if not authenticated
    if (!session.userId) {
        return redirect("/sign-in");
    }

    const parsedFolderId = parseInt(params.folderId);

    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>;
    }

    // Get the folder to check ownership
    const folder = await QUERIES.getFolderById(parsedFolderId);
    
    // If folder doesn't exist, show access denied
    if (!folder) {
        return <AccessDenied />;
    }
    
    // Check if current user is the owner of the folder
    if (folder.ownerId !== session.userId) {
        return <AccessDenied />;
    }

    // User is authorized, load folder content
    const [folders, files, parents] = await Promise.all([
        QUERIES.getFolders(parsedFolderId), 
        QUERIES.getFiles(parsedFolderId), 
        QUERIES.getAllParentsForFolder(parsedFolderId)
    ]);
    
    return <DriveContents files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} />;
}