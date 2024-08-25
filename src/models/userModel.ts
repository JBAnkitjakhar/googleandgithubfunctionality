 
// src/models/userModel.ts

import mongoose, { Schema, Model } from "mongoose";
import dbConnect from "@/lib/db";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  password?: string;
  googleId?: string;
  githubId?: string; 
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  password: { type: String, select: false },
  googleId: { type: String },
  githubId: { type: String }, 
});

let User: Model<IUser>;

export async function getUserModel(): Promise<Model<IUser>> {
  await dbConnect();
  if (mongoose.models.User) {
    User = mongoose.models.User as Model<IUser>;
  } else {
    User = mongoose.model<IUser>("User", userSchema);
  }
  return User;
}