import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: "Token expired or invalid" },
      { status: 401 }
    );
  }

  // If the token is valid, you can proceed with your API logic here
  const posts = await fetch(process.env.POSTS_API_URL!).then((response) =>
    response.json()
  );

  return NextResponse.json({ posts });
}
