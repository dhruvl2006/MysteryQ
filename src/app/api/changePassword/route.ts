import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
const jwt = require("jsonwebtoken");

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const username = decoded.name;

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
  } catch (error: any) {
    console.log("Error:", error.message);

    // Handle token-specific errors
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    } else if (error.name === "TokenExpiredError") {
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
