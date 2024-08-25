// //src/components/client/form.tsx 

// "use client";

// import { useState } from "react";
// import { toast } from "sonner";
// import { credentialsLogin } from "@/actions/login";
// import { useRouter } from "next/navigation";

// const LoginForm = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({ email: "", password: "" });

//   const validateForm = (email: string, password: string) => {
//     const newErrors = { email: "", password: "" };
//     let isValid = true;

//     if (!email) {
//       newErrors.email = "Email is required";
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = "Email is invalid";
//       isValid = false;
//     }

//     if (!password) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     } else if (password.length < 3) {
//       newErrors.password = "Password must be at least 4 characters";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const loginhell = async (formData: FormData) => {
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;
  
//     if (!validateForm(email, password)) {
//       return;
//     }
  
//     setIsLoading(true);
//     const toastId = toast.loading("Logging in");
  
//     try {
//       const result = await credentialsLogin(email, password);
  
//       if (result.success) {
//         toast.success("Login successful", { id: toastId });
//         router.refresh();
//         router.push("/dashboard");
//       } else {
//         toast.error(result.error, { id: toastId });
//         if (result.error === "Invalid email or password") {
//           setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
//         } else if (result.error === "Please provide all fields") {
//           setErrors({ email: "Email is required", password: "Password is required" });
//         }
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("An unexpected error occurred. Please try again later.", { id: toastId });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form action={loginhell} className="space-y-4">
//       <div>
//         <input 
//           type="email" 
//           placeholder="Email" 
//           name="email"
//           className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
//         />
//         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//       </div>
//       <div>
//         <input 
//           type="password" 
//           placeholder="Password" 
//           name="password"
//           className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
//         />
//         {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//       </div>
//       <button 
//         type="submit"
//         disabled={isLoading}
//         className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
//       >
//         {isLoading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// }

// export { LoginForm };

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { credentialsLogin } from "@/actions/login";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = (email: string, password: string) => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 4 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const loginhell = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    if (!validateForm(email, password)) {
      return;
    }
  
    setIsLoading(true);
    const toastId = toast.loading("Logging in");
  
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
  
      if (result?.error) {
        toast.error(result.error, { id: toastId });
        if (result.error === "Invalid email or password") {
          setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
        } else if (result.error === "Please provide all fields") {
          setErrors({ email: "Email is required", password: "Password is required" });
        }
      } else {
        toast.success("Login successful", { id: toastId });
        router.refresh();
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again later.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={loginhell} className="space-y-4">
      <div>
        <input 
          type="email" 
          placeholder="Email" 
          name="email"
          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <input 
          type="password" 
          placeholder="Password" 
          name="password"
          className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export { LoginForm };