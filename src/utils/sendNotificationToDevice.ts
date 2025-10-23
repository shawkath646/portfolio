"use server";

import { admin } from "@/lib/firebase";
import { messaging } from "firebase-admin";

interface SendMessageProps {
  fcmToken: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
  priority?: "high" | "normal";
  androidChannelId?: string;
  iosBadgeCount?: number;
}

/**
 * Constructs and sends a push notification to a specific device.
 *
 * @param props - The simplified notification properties.
 * @returns The message ID on successful sending.
 * @throws Will throw an error if the message fails to send.
 */
export const sendNotificationToDevice = async (props: SendMessageProps) => {
  const {
    fcmToken,
    title,
    body,
    data,
    priority = 'high',
    androidChannelId = 'default_channel',
    iosBadgeCount,
  } = props;

  if (!fcmToken) {
    throw new Error("fcmToken must be a non-empty string.");
  }

  const message: messaging.Message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    // Fix: Use the `data` prop directly. Provide an empty object if it's undefined.
    data: data ?? {},
    android: {
      priority,
      notification: {
        channelId: androidChannelId,
        sound: 'default',
      },
    },
    apns: {
      headers: {
        'apns-priority': priority === 'high' ? '10' : '5',
      },
      payload: {
        aps: {
          sound: 'default',
          ...(iosBadgeCount !== undefined && { badge: iosBadgeCount }),
        },
      },
    },
    webpush: {
        headers: {
            Urgency: priority,
        }
    }
  };

  try {
    const messageId = await admin.messaging().send(message);
    return messageId;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error("Failed to send notification.");
  }
};

export default sendNotificationToDevice;