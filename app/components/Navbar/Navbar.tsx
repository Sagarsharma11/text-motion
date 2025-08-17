"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">
          ⚡ Creator Tools
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-blue-400 transition">
            Text Motion
          </Link>
          <Link href="/flash" className="hover:text-blue-400 transition">
            Flash
          </Link>
          <Link href="/maps" className="hover:text-blue-400 transition">
            Maps
          </Link>
        </div>
      </div>
    </nav>
  );
}
