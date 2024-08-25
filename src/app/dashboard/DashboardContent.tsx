// //src/app/dashboard/DashboardContent.tsx

// "use client";

// import { User } from "next-auth";
// import { LogoutButton } from "@/components/LogoutButton";
// import Link from "next/link";
// import CollegeTable from "@/components/CollegeTable";

// interface DashboardContentProps {
//   user: User;
// }

// export default function DashboardContent({ user }: DashboardContentProps) {
//   return (
//     <div>

//       {/* Your dashboard content */}

//           Welcome, {user.name}

//       <p className="mt-2 ">
//           <Link href="/" className="text-sm text-blue-600 hover:underline">
//             Home page
//           </Link>
//         </p>

//           <LogoutButton  />
//           <CollegeTable />
//     </div>
//   );
// }

import { User } from "next-auth";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";
import CollegeTable from "@/components/CollegeTable";

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <div>
          <Link href="/" className="text-primary hover:underline mr-4">
            Home page
          </Link>
          <LogoutButton />
        </div>
      </div>
      <CollegeTable />
    </div>
  );
}