// // src/app/dashboard/page.tsx
// "use client";

// import { useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import DashboardContent from "./DashboardContent";

// export default function DashboardPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/login');
//     }
//   }, [status, router]);

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (!session?.user) {
//     return null;
//   }

//   return <DashboardContent user={session.user} />;
// }

// src/app/dashboard/page.tsx
import { auth } from "@/auth"
import DashboardContent from "./DashboardContent"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return <DashboardContent user={session.user} />
}