import { NextRequest, NextResponse } from "next/server";
import getSiteAccess from "@/actions/secure/getSiteAccess";
import { SiteCodeType } from "@/types";

const SITE_CODE: SiteCodeType = "client-app" as const;

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { success: false, message: "Password not provided in body!" },
      { status: 400 }
    );
  }

  const response = await getSiteAccess(SITE_CODE, password);

  const status = response.success ? 200 : 401; 
  return NextResponse.json(response, { status });
}
