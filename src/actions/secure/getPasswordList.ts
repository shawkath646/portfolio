"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { PasswordObjectType } from "@/app/admin/security/PasswordManagement";
import { timestampToDate } from "@/utils/timestampToDate";

const getPasswordList = cache(async () => {
  const passwordSnapshot = await db.collection("passwords").get();

  const passwordList = passwordSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      expiresAt: timestampToDate(data.expiresAt),
    };
  }) as PasswordObjectType[];

  return passwordList;
});

export default getPasswordList;
