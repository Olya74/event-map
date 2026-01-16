export const getErrorMessage = (err: any,msg:string): string => {
  if (err?.data?.errors?.length) {
    return err.data.errors[0].msg;
  }

  if (err?.data?.message) {
    return err.data.message;
  }

  return msg || "An unknown error occurred";
};


export const getErrorMessageForm = (
  err: unknown,
  fallback = "An unknown error occurred"
): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err
  ) {
    const data = (err as any).data;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0].msg;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }
  }

  return fallback;
};
