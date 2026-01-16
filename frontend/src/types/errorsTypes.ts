export type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export interface ApiError {
  data?: {
    message?: string;
    errors?: { msg: string }[];
  };
  status?: number;
}
