import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { verifyUserforPassword } from "@/helpers/verifyUserforPassowrd";
import { NextResponse } from "next/server";

const jwt = require("jsonwebtoken");

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username } = await request.json();
    console.log(username);

    const user = await UserModel.findOne({
      $or: [{ username: username }, { email: username }],
    });

    console.log(user);

    if (user) {
      const email = user.email;
      console.log(email);

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign(
        {
          name: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );

      const tokenExpiry = new Date();
      tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 5);

      user.resetingToken = token;
      user.resetingPassword = true;
      user.tokenExpiry = tokenExpiry;

      await user.save();

      console.log(user);

      const emailResponse = await verifyUserforPassword(email, username, token);

      if (!emailResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Please verify your email",
        },
        {
          status: 201,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "User not found with this Email/Username",
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
