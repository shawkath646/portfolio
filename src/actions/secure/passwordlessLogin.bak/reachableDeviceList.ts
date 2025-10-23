"use server";
import { db } from "@/lib/firebase";
import { timestampToDate } from "@/utils/timestampToDate";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { pingDevice } from "./notifyDevice";
import { ClientAppType, DeviceWithReachabilityType } from "./types";

// Cache for device reachability status with expiration time
type DeviceCache = {
    [deviceId: string]: {
        isReachable: boolean;
        timestamp: number;
    }
};

const deviceReachabilityCache: DeviceCache = {};
const CACHE_EXPIRY_MS = 60000; // 1 minute cache expiry

// Cached function to fetch devices from the database
const getDevicesFromDb = unstable_cache(
    async () => {
        console.log("Cache miss: Fetching devices from database");
        const clientApps = await db.collection("client-apps").get();
        return clientApps.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                lastActive: timestampToDate(data.lastActive)
            } as ClientAppType;
        });
    },
    ["client-apps-list"],
    { revalidate: 60 } // Revalidate every 60 seconds
);

// Check if device is reachable with cache
const checkDeviceReachability = async (device: ClientAppType): Promise<boolean> => {
    const deviceId = device.id;
    const now = Date.now();
    
    // Check if we have a valid cache entry
    if (
        deviceReachabilityCache[deviceId] && 
        now - deviceReachabilityCache[deviceId].timestamp < CACHE_EXPIRY_MS
    ) {
        console.log(`Using cached reachability status for device ${deviceId}`);
        return deviceReachabilityCache[deviceId].isReachable;
    }
    
    // No valid cache, check reachability using our centralized ping function
    const isReachable = await pingDevice({
        id: device.id,
        fcmToken: device.fcmToken,
        deviceName: device.deviceName,
        deviceOs: device.deviceOs
    });
    
    // Cache the result
    deviceReachabilityCache[deviceId] = {
        isReachable,
        timestamp: now
    };
    
    return isReachable;
};

// Set concurrency limit to avoid overwhelming FCM
const checkDevicesWithConcurrencyLimit = async (
    devices: ClientAppType[],
    concurrencyLimit = 5
): Promise<DeviceWithReachabilityType[]> => {
    const results: DeviceWithReachabilityType[] = [];
    const chunks: ClientAppType[][] = [];
    
    // Split devices into chunks based on concurrency limit
    for (let i = 0; i < devices.length; i += concurrencyLimit) {
        chunks.push(devices.slice(i, i + concurrencyLimit));
    }
    
    // Process each chunk sequentially, but devices within a chunk in parallel
    for (const chunk of chunks) {
        const chunkResults = await Promise.all(
            chunk.map(async (device) => {
                const isReachable = await checkDeviceReachability(device);
                return {
                    ...device,
                    isReachable,
                    lastChecked: Date.now()
                };
            })
        );
        
        results.push(...chunkResults);
    }
    
    return results;
};

// Main function with caching
export const reachableDeviceList = cache(async (): Promise<DeviceWithReachabilityType[]> => {
    // Get devices from cache or database
    const devices = await getDevicesFromDb();
    
    // Check reachability with concurrency control
    const devicesWithReachability = await checkDevicesWithConcurrencyLimit(devices);
    
    // Sort by reachability status (reachable first) and then by last active date
    return devicesWithReachability.sort((a, b) => {
        if (a.isReachable !== b.isReachable) {
            return a.isReachable ? -1 : 1;
        }
        // If both have same reachability status, sort by last active (most recent first)
        return b.lastActive.getTime() - a.lastActive.getTime();
    });
});