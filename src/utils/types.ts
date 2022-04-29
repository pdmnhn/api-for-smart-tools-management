export interface UserType {
  user_id: number;
  email: string;
  password_hash: string;
}

export interface FetchedToolsType {
  tool_code: number;
  tooltype_name: string;
  subtype_name: string;
  brand_name: string;
  category_name: string;
  usage_type: string;
  rack: number;
  current_status: string;
  last_scan: string;
}

export type UserTypeForToken = Omit<UserType, "password_hash">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUserForToken = (object: any): object is UserTypeForToken => {
  return "user_id" in object && "email" in object;
};

export const isString = (value: unknown): value is string => {
  return (
    value !== undefined &&
    (value instanceof String || typeof value === "string")
  );
};
