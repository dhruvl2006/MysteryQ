import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token, newPassword } = await request.json();

    console.log("New password:", newPassword);

    if (typeof newPassword !== "string" || !newPassword.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password provided",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof token !== "string" || !token) {
      throw new Error("Invalid token format");
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(decoded);

    const username = (decoded as { name: string }).name;

    const user = await UserModel.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (user) {
      console.log(user.resetingPassword);
      if (!user.resetingPassword) {
        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 201 }
        );
      }
      const resetingPassword = user.resetingPassword;

      if (resetingPassword) {
        const changedPassword = await bcrypt.hash(newPassword, 10);
        user.password = changedPassword;
        user.resetingPassword = false;

        await user.save();

        if (!user.password) {
          return NextResponse.json(
            {
              success: false,
              message: "Unable to update password, please try again later.",
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { success: true, message: "Password updated successfully!" },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: "Please request a password reset first." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("Error:", errorMessage);

    if (errorMessage === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    } else if (errorMessage === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Token has expired." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
