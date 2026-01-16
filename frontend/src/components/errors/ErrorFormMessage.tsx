import { forwardRef } from "react";
import "./error-message.css";
import type { FormErrors } from "../../types/errorsTypes"; 

const ErrorFormMessage = forwardRef<HTMLDivElement, { error: FormErrors }>(
  ({ error }, ref) => {
    if (!error.email && !error.password && !error.form) return null;

    return (
      <div className="error" aria-live="assertive" ref={ref}>
        {error.form && <span>{error.form}</span>}
        {error.email && <span>{error.email}</span>}
        {error.password && <span>{error.password}</span>}
      </div>
    );
  }
);

export default ErrorFormMessage;
