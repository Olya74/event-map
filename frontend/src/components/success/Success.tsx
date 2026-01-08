import "./success.css";
import { forwardRef } from "react";

type SuccessProps = {
  success: string;
};

const Success = forwardRef<HTMLDivElement, SuccessProps>(({ success }, ref) => {
  return (
    <div className="success" aria-live="assertive" ref={ref}>
      {success}
    </div>
  );
});

export default Success;
