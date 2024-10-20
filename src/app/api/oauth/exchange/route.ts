import { requiredUser } from "@/utils/hook";
import { nylas } from "@/utils/nylas";
import { nylasConfig } from "@/utils/nylasConfig";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await requiredUser();

  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      code,
      redirectUri: nylasConfig.redirectUri,
    });

    const { grantId, email } = response;

    await prisma.user.update({
      where: {
        id: session?.id,
      },
      data: {
        grantEmail: email,
        grantId,
      },
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error(error);
  }
}
