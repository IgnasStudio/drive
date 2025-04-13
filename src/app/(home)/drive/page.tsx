import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();

  // If user is not logged in then redirect to sign in page
  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center h-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to Ignas Studio Drive
        </h1>
        <p className="text-lg text-gray-600 max-w-md mb-8">
          You need to create a drive to start storing your files
        </p>
        <form
          action={async () => {
            "use server";
            const session = await auth();

            if (!session.userId) {
              return redirect("/sign-in");
            }

            const rootFolderId = await MUTATIONS.onboardUser(session.userId);

            return redirect(`/f/${rootFolderId}`);
          }}
        >
          <Button 
            size="lg" 
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 text-xl px-10 py-6 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Create New Drive
          </Button>
        </form>
      </div>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
}