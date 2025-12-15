import { NextResponse } from "next/server";
import prisma from "@/src/shared/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/src/shared/lib/jwt";

export const POST = async (req: Request) => {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields should be filled" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (exists) {
      return NextResponse.json({ error: "Already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      },
    });

    const token = signToken({ id: user.id });

    const response = NextResponse.json({ ok: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server failed" }, { status: 500 });
  }
};
