export interface UserForToken {
  user_id: number;
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUserForToken = (object: any): object is UserForToken => {
  return "user_id" in object && "email" in object;
};

export const isString = (value: unknown): value is string => {
  return (
    value !== undefined &&
    (value instanceof String || typeof value === "string")
  );
};
