import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  console.log("Home -> user", user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700 text-white">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-2">Programmers Guild</h1>
        <p className="text-xl">Become a member of guild...</p>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md">
        {user ? (
          <div className="text-center">
            <p className="text-2xl font-semibold mb-2">Welcome, {user.name || user.email || 'User'}!</p>
            <p className="mb-4">Email: {user.email || 'Not provided'}</p>
            {/* {user.image && <img src={user.image} alt="User avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />} */}
          </div>
        ) : (
          <p className="text-center text-xl mb-4">Not logged in</p>
        )}
        
        <div className="flex flex-col gap-3">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Login
          </Link>
          <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Sign Up
          </Link>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
