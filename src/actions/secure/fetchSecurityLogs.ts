"use server";
import { db } from "@/lib/firebase";
import { LoginAttemptObjectType } from "./getSiteAccess";
import { timestampToDate } from "@/utils/timestampToDate";


export interface LockoutType {
  id: string;
  ip: string;
  siteCode: string;
  lockoutStart: Date;
  lockoutEnd: Date;
  failedAttempts: number;
  lockoutDurationHours: number;
}

export async function fetchSecurityLogs(
  limit: number = 10, 
  offset: number = 0
): Promise<{
  attempts: LoginAttemptObjectType[];
  lockouts: LockoutType[];
}> {
  try {
    // Fetch login attempts
    let attemptsQuery = db.collection("login-attempts")
      .orderBy("timestamp", "desc");
    
    // Apply pagination
    if (offset > 0) {
      // First get the document at the offset position
      const offsetSnapshot = await db.collection("login-attempts")
        .orderBy("timestamp", "desc")
        .limit(offset)
        .get();

      // If we have results and reached the offset, start after the last document
      if (!offsetSnapshot.empty && offsetSnapshot.docs.length === offset) {
        const lastVisible = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        attemptsQuery = attemptsQuery.startAfter(lastVisible);
      }
    }
    
    // Apply the limit
    attemptsQuery = attemptsQuery.limit(limit);
    
    // Execute the query
    const attemptsSnapshot = await attemptsQuery.get();
      
    const attemptsData = attemptsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ip: data.ip,
        userAgent: data.userAgent,
        success: data.success,
        siteCode: data.siteCode,
        timestamp: data.timestamp.toDate(),
        isAdministrator: data.isAdministrator,
        failedReason: data.failedReason,
        address: data.address
      } as LoginAttemptObjectType;
    });

    // Fetch lockout history
    let lockoutsQuery = db.collection("lockout-history")
      .orderBy("lockoutStart", "desc");
    
    // Apply pagination for lockouts
    if (offset > 0) {
      // First get the document at the offset position
      const offsetSnapshot = await db.collection("lockout-history")
        .orderBy("lockoutStart", "desc")
        .limit(offset)
        .get();

      // If we have results and reached the offset, start after the last document
      if (!offsetSnapshot.empty && offsetSnapshot.docs.length === offset) {
        const lastVisible = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        lockoutsQuery = lockoutsQuery.startAfter(lastVisible);
      }
    }
    
    // Apply the limit
    lockoutsQuery = lockoutsQuery.limit(limit);
    
    // Execute the query
    const lockoutsSnapshot = await lockoutsQuery.get();
      
    const lockoutsData = lockoutsSnapshot.docs.map(doc => ({
      ...doc.data(),
      lockoutStart: timestampToDate(doc.data().lockoutStart),
      lockoutEnd: timestampToDate(doc.data().lockoutEnd)
    })) as LockoutType[];
    
    return {
      attempts: attemptsData,
      lockouts: lockoutsData
    };
  } catch (error) {
    console.error("Error fetching security data:", error);
    throw new Error("Failed to fetch security logs");
  }
}
