import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import withClientAppAuth from "@/utils/withClientAppAuth";

export const POST = withClientAppAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { fcmToken, deviceName, deviceOs, deviceId } = body;
    if (!fcmToken || !deviceName || !deviceOs) {
      return NextResponse.json(
        { error: "Missing required fields: fcmToken, deviceName, and deviceOs are required." },
        { status: 400 }
      );
    }

    const deviceData = {
      fcmToken,
      deviceName,
      deviceOs,
      lastActive: FieldValue.serverTimestamp(),
    };

    if (deviceId) {
      const deviceRef = db.collection("client-apps").doc(deviceId);
      await deviceRef.set(deviceData, { merge: true });

      return NextResponse.json(
        {
          success: true,
          message: "Device updated successfully.",
          deviceId: deviceId,
        },
        { status: 200 }
      );
    } else {
      const newDeviceRef = await db.collection("client-apps").add(deviceData);

      return NextResponse.json(
        {
          success: true,
          message: "Device registered successfully.",
          deviceId: newDeviceRef.id,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Device registration failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
});