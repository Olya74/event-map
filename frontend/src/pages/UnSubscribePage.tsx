import { useLocation, useNavigate } from "react-router-dom";
import {
  useUnsubscribeFromEventMutation,
  useConfirmUnsubscribeFromEventMutation,
} from "../app/services/events/EventService";
import { useEffect, useState, useMemo, useRef } from "react";
import { getErrorMessage } from "../helpers/functions/errorHelper";

const UnSubscribePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [unsubscribeFromEvent] = useUnsubscribeFromEventMutation();
  const [confirmUnsubscribe] = useConfirmUnsubscribeFromEventMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const eventId = params.get("eventId");
  const token = params.get("token");

  const hasRun = useRef(false);

  // 🚀 AUTO EMAIL UNSUBSCRIBE
  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    const autoUnsubscribe = async () => {
      try {
        setIsLoading(true);
        const data = await confirmUnsubscribe(token).unwrap();
        setSuccessMsg(data.message);
      } catch (error) {
        setErrorMsg(getErrorMessage(error, "Invalid or expired link"));
      } finally {
        setIsLoading(false);
      }
    };

    autoUnsubscribe();
  }, [token, confirmUnsubscribe]);

  // redirect after success
  useEffect(() => {
    if (!successMsg) return;

    const timeout = setTimeout(() => {
      if (token) navigate(`/events`);
      else {
        navigate(-1);
      }
    }, 2500);

    return () => clearTimeout(timeout);
  }, [successMsg, navigate, eventId, token]);

  const handleManualUnsubscribe = async () => {
    if (!eventId) {
      setErrorMsg("Event ID missing");
      return;
    }

    try {
      setIsLoading(true);
      const data = await unsubscribeFromEvent(eventId).unwrap();
      setSuccessMsg(data.message);
    } catch (error) {
      setErrorMsg(getErrorMessage(error, "Failed to unsubscribe"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center">
        {isLoading && (
          <div className="mb-6 text-lg font-medium animate-pulse">
            Processing request...
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 text-red-600 font-medium">{errorMsg}</div>
        )}

        {successMsg && (
          <div className="mb-4 text-green-600 font-medium">{successMsg}</div>
        )}

        {!token && !successMsg && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Confirm Unsubscription
            </h2>

            <p className="text-gray-600 mb-8">
              Are you sure you want to unsubscribe from this event?
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={handleManualUnsubscribe}
                disabled={isLoading}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition disabled:opacity-50"
              >
                Yes, unsubscribe
              </button>

              <button
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UnSubscribePage;
