import { NextResponse } from "next/server";
import getLoginSession from "@/actions/secure/getLoginSession";
import { db } from "@/lib/firebase";

export async function GET() {
    const loginSession = await getLoginSession("admin-panel");
    if (!loginSession.isAdministrator) {
        return NextResponse.json({ success: false, message: "" });
    }



    return NextResponse.json({ success: true, message: "Test action done successfully!" }, { status: 200 });
}