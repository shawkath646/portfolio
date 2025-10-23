"use server";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";


interface IAddress {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

interface IPhoneNumber {
  countryCode: string;
  number: string;
}

export interface AdminDataType {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  presentAddress: IAddress;
  permanentAddress: IAddress;
  emails: string[];
  phoneNumbers: IPhoneNumber[];
  profilePictureUrl: string;
}

const getAdminData = cache(async() => {
    const docRef = await db.collection("site-config").doc("admin-data").get();
    const adminData = docRef.data() as AdminDataType;
    adminData.dateOfBirth = timestampToDate(adminData.dateOfBirth);
    return adminData;
});

export default getAdminData;