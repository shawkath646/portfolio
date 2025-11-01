export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SiteCodeType = "admin-panel" | "client-app" | "personal-life" | "friends-corner" | "love-corner";

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