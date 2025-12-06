import { NextResponse } from "next/server";
import prisma from "@/src/shared/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/src/shared/lib/jwt";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields should be filled" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Not a correct email or password" },
        { status: 401 }
      );
    }
    const token = signToken({ id: user.id });
    const res = NextResponse.json({ ok: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Server failed" }, { status: 500 });
  }
};
