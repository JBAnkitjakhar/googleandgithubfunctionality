//src/actions/signup.ts

"use server";

import { getUserModel } from "@/models/userModel";
import { hash } from "bcryptjs";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password || !name) {
    return { success: false, message: "Please provide all fields" };
  }

  try {
    const User = await getUserModel();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "An error occurred during sign up" };
  }
}