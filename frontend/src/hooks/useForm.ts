import { useCallback } from "react";

type SubmitHandler = (
  formData: FormData,
  e: React.FormEvent<HTMLFormElement>
) => void | Promise<void>;

const useForm = () => {
  const handleSubmit = useCallback(
    (onSubmit: SubmitHandler) =>
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        await onSubmit(formData, e);
      },
    []
  );

  return { handleSubmit };
};

export default useForm;
