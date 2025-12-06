import { NextResponse } from "next/server";
import prisma from "@/src/shared/lib/prisma";
import bcrypt from "bcryptjs";

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

    const user = prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        avatarUrl: `https://api.dicebar.com/7.x/adventurer/svg?seed=${username}`,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Server failed" }, { status: 500 });
  }
};
