// //src/actions/login.ts

// "use server";
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";

// const credentialsLogin = async (email: string, password: string) => {
//   try {
//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       // Handle AuthError
//       if (result.error) {
//         return { success: false, error: result.error.message };
//       }

//       // Handle other error cases
//       switch (result.error) {
//         case "provide all feilds":
//           return { success: false, error: "Please provide all fields" };
//         default:
//           console.error("Unhandled error:", result.error);
//           return {
//             success: false,
//             error: "An unexpected error occurred. Please try again later.",
//           };
//       }
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Login error:", error);
//     if (error instanceof AuthError) {
//       return { success: false, error: error.message };
//     }
//     return {
//       success: false,
//       error: " Please try again later!",
//     };
//   }
// };

// export { credentialsLogin };


// src/actions/login.ts
"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function credentialsLogin(
  prevState: any,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    throw error
  }
}