import React from 'react';
import { LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-50">
            <LockIcon size={40} className="text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to view this folder. Only the folder owner can access this content.
        </p>
        <Link href="/drive">
          <Button 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 w-full"
          >
            Go to My Drive
          </Button>
        </Link>
      </div>
    </div>
  );
}