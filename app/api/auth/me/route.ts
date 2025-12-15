import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/src/shared/lib/prisma";
import { verifyToken } from "@/src/shared/lib/jwt";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
};
