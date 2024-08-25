// // src/components/LogoutButton.tsx
// "use client";

// import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export function LogoutButton() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     await signOut({ redirect: false });
//     router.push("/");
//     router.refresh();
//   };

//   return (
//     <button onClick={handleLogout} className="btn btn-secondary">
//       Logout
//     </button>
//   );
// }

// src/components/LogoutButton.tsx
"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="btn btn-secondary">
      Logout
    </button>
  )
}