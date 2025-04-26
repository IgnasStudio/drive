import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/Button";

export default async function IgnasStudioDrive() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center text-center w-full">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
        Ignas Studio Drive
      </h1>
      <p className="text-base sm:text-lg text-gray-600 max-w-md mb-6 sm:mb-8">
        A simple cloud storage solution for all your files.
      </p>
      <form
      action={async () => {
        "use server";

        const session = await auth();

        // If user is not logged in then redirect to sign in page
        if (!session.userId) {
          return redirect("/sign-in");
        }

        // Otherwise, redirect to the drive page
        return redirect("/drive");
      }}
    > 
        <Button 
          size="lg" 
          type="submit" 
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 text-base sm:text-xl px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-lg transition-all hover:scale-105"
        >
          Get Started Now
        </Button>
      </form>
    </div>
  );
}