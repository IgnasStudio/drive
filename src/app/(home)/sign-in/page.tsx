import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/Button";

export default async function HomePage() {
  
  const session = await auth();

  // If user is already logged in then redirect to drive page
  if (session.userId) {
    return redirect("/drive");
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center h-full">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Sign In to Ignas Studio Drive
      </h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        Access your files and continue your storage adventure
      </p>
      <SignInButton 
        forceRedirectUrl={"/drive"}
        mode="modal"
      >
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 text-xl px-10 py-6 rounded-xl shadow-lg transition-all hover:scale-105"
        >
          Sign In
        </Button>
      </SignInButton>
    </div>
  );
}