export const getErrorMessage = (err: any,msg:string): string => {
  if (err?.data?.errors?.length) {
    return err.data.errors[0].msg;
  }

  if (err?.data?.message) {
    return err.data.message;
  }

  return msg || "An unknown error occurred";
};