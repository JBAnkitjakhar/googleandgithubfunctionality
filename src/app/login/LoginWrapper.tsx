// // src/app/login/LoginWrapper.tsx

// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import LoginPage from "./LoginPage";

// export default async function LoginWrapper() {
//   const session = await auth();

//   if (session?.user) {
//     redirect("/dashboard");
//   }

//   return <LoginPage />;
// }

// src/app/login/LoginWrapper.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LoginPage from "./LoginPage"

export default async function LoginWrapper() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return <LoginPage />
}