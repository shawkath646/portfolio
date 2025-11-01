"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";
import { AddressType, PhoneNumberType } from "@/types";

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
    adminData.dateOfBirth = timestampToDate(adminData.dateOfBirth);
    return adminData;
});

export default getAdminData;