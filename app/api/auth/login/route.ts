import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Simulate user authentication (In practice, query a database)
const authenticateUser = (username: string, password: string) => {
  if (username === "user" && password === "password") {
    return { id: 1, username: "user" };
  }
  return null;
};

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing username or password" },
      { status: 400 }
    );
  }

  const user = authenticateUser(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  return NextResponse.json({ accessToken, refreshToken, user });
}
