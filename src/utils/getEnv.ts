import "server-only";

export function getEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined || value === "") {
    throw new Error(`Error: Environment variable "${key}" is not defined`);
  }

  return value;
}