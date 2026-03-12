import { NextRequest, NextResponse } from "next/server";
import { verify2FA } from "@/actions/authentication/authActions";
import getErrorMessage from "@/utils/getErrorMessage";

export async function POST(req: NextRequest) {
  try {
    const { attemptId, code } = await req.json();

    if (!attemptId || !code) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: attemptId, code" },
        { status: 400 }
      );
    }

    const response = await verify2FA(attemptId, code);

    const status = response.success ? 200 : 401;
    return NextResponse.json(response, { status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) ?? "Internal server error!" },
      { status: 500 }
    );
  }
}
