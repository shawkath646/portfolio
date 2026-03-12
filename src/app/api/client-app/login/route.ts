import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { performLogin } from "@/actions/authentication/authActions";
import getErrorMessage from "@/utils/getErrorMessage";

export async function POST(req: NextRequest) {
  const headerList = await headers();
  const platformHeader = headerList.get("x-device-platform");

  try {
    const { password } = await req.json();

    if (!platformHeader) {
      return NextResponse.json(
        { success: false, message: "Platform type not provided in header!" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password not provided in body!" },
        { status: 400 }
      );
    }

    const response = await performLogin(password);

    // Response now includes attemptId and availableMethods for 2FA flow
    // Client should call /api/client-app/verify-2fa with attemptId + method + code
    const status = response.success ? 200 : 401;
    return NextResponse.json(response, { status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) ?? "Internal server error!" },
      { status: 500 }
    )
  }
}
