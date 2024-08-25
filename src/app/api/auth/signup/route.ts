//src\app\api\auth\signup\route.ts
 

import { signUp } from '@/actions/signup';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await signUp(formData);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, message: "An error occurred during sign up" }, { status: 500 });
  }
}