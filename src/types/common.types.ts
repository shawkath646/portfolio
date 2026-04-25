import { AccessScopeLabel } from "./genericAuth.types";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PlatformType = "android" | "desktop" | "web";

export type AuthTokenPayload = {
  sessionId: string;
}

export interface APIResponseType {
  success: boolean;
  message: string;
}

export interface CursorPaginationOptions {
  startAfter?: string;
  limit?: number;
}

export interface AddressType {
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  continent?: string;
  countryCode?: string;
  timezone?: string;
}

export interface PhoneNumberType {
  countryCode: string;
  number: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  desc: string;
  timestamp: Date;
}


export interface PersonObj {
  id: string;
  name: string;
  slug: string;
  profile: string;
  mdxUrl: string;
  dateOfBirth: Date | null;
  meetOn: Date;
  leftOn: Date | null;
  gender: "male" | "female" | "others";
  relation: string[];
  relatedTo: AccessScopeLabel;
  isLoveTimeline: boolean;
  timestamp: Date;
}