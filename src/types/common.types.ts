export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PlatformType = "android" | "desktop" | "web";

export type AuthTokenPayload ={
  sessionId: string;
}

export interface APIResponseType {
  success: boolean;
  message: string;
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



