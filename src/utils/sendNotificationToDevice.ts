"use server";

import { messaging } from "firebase-admin";
import { admin } from "@/lib/firebase";

interface SendMessageProps {
  fcmToken: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
  priority?: "high" | "normal";
  androidChannelId?: string;
  iosBadgeCount?: number;
}

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