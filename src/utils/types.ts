export interface UserType {
  user_id: number;
  email: string;
  password_hash: string;
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
