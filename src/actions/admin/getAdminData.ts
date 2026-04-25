"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { AddressType, PhoneNumberType } from "@/types/common.types";
import { timestampToDate } from "@/utils/dateTime";

export interface AdminDataType {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  presentAddress: AddressType;
  permanentAddress: AddressType;
  emails: string[];
  phoneNumbers: PhoneNumberType[];
  profilePictureUrl: string;
}

const getAdminData = cache(async() => {
    const docRef = await db.collection("site-config").doc("admin-data").get();
    const adminData = docRef.data() as AdminDataType;
    return {
      ...adminData,
      dateOfBirth: timestampToDate(adminData.dateOfBirth)
    };
});

export default getAdminData;