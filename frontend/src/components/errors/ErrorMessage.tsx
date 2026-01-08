import { forwardRef } from "react";
import "./error-message.css";

type ErrorProps = {
  error: string;
};

const ErrorMessage = forwardRef<HTMLDivElement, ErrorProps>(
  ({ error }, ref) => {
    return (
      <div className="error" aria-live="assertive" ref={ref}>
        {error}
      </div>
    );
  }
);

export default ErrorMessage;
