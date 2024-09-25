import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    return null;
  }
};
export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded === "string") {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }

  // Issue a new access token
  const newAccessToken = jwt.sign(
    { userId: (decoded as jwt.JwtPayload).userId },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  return NextResponse.json({ accessToken: newAccessToken });
}
