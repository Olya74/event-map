import type { FC } from "react";
import type { IEvent } from "../../../models/IEvent";
import { NavLink } from "react-router-dom";
import { useDeleteEventMutation, useJoinEventMutation,useLeaveEventMutation } from "../EventService";
import nullBeforeDate from "../../../../helpers/functions/nullBeforeDate";
import { useAppSelector } from "../../../hooks/hooks";
import { selectedCurrentUser } from "../../../features/auth/authSlice";
import ErrorMessage from "../../../../components/errors/ErrorMessage";
import Success from "../../../../components/success/Success";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../../helpers/functions/errorHelper";
import { useNavigate } from "react-router-dom";

interface EventItemProps {
  event: IEvent;
}

const EventItem: FC<EventItemProps> = ({ event }) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectedCurrentUser);
  const isOwner = event.creator === currentUser?.id;
  const isJoined=event.attendees.includes(currentUser?.id || "");
  const [deleteEvent, { isLoading }] = useDeleteEventMutation();
  const [joinEvent,{isLoading: isJoining}] = useJoinEventMutation();
  const [leaveEvent, {isLoading: isLeaving}] = useLeaveEventMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const [successMsg, setSuccessMsg] = useState<string | null>("");

  useEffect(() => {
    if (!errorMsg && !successMsg) return;
    const timer = setTimeout(() => {
      setErrorMsg(null);
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [errorMsg, successMsg]);
 
const handleJoinToggle = async (idEvent: string,idUser: string) => {
   if (!currentUser) {
    navigate("/login");
    return;
  }
    try {
      if (isJoined) {
        const res = await leaveEvent({ eventId: idEvent,userId: idUser }).unwrap();
        setSuccessMsg(res.message);
      } else {
        const res = await joinEvent({ eventId: idEvent, userId: idUser  }).unwrap();
        setSuccessMsg(res.message);
      }
    } catch(err: any) {
      setErrorMsg(getErrorMessage(err, "Failed to join the event."));
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteEvent(event._id).unwrap();
      setSuccessMsg(res.message);
    } catch(err: any) {
     setErrorMsg(getErrorMessage(err, "Failed to delete the event."));
    }
  };

  return (
    <article className="max-w-4xl mx-auto w-full bg-gray-200 rounded-2xl shadow-md p-6 flex flex-col transition hover:shadow-lg">
      {/* FEEDBACK */}
      {errorMsg && <ErrorMessage error={errorMsg} />}
      {successMsg && <Success success={successMsg} />}

      {/* HEADER */}
      <header className="mb-3 text-center">
        <h2 className="font-bold text-gray-700 text-xl md:text-2xl">
          {event.title}
        </h2>
        <p className="text-blue-600 text-sm">
          {nullBeforeDate(event.date)}
        </p>
      </header>

      {/* DESCRIPTION */}
      <p className="text-gray-700 leading-relaxed line-clamp-3 mb-4">
        {event.description}
      </p>

      {/* INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
        <p>
          <span className="font-medium">GPS:</span>{" "}
          {event.location.lat.toFixed(2)}, {event.location.lng.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Address:</span>{" "}
          {event.address?.street !== "Not specified" && event.address?.street}{" "}
          {event.address?.number !== "Not specified" && event.address?.number}{" "}
          {event.address?.zip !== "Not specified" && event.address?.zip} Berlin
        </p>
      </div>

      {/* MEDIA */}
      {event.media?.length > 0 && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img
            src={event.media[0].url}
            alt={event.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* ACTIONS */}
      <footer className="mt-auto pt-4 border-t flex justify-between items-center ">
        {!isOwner ? (
          <button
            className={`
    px-4 py-2 rounded-lg transition
    ${isJoined
      ? "bg-green-600 text-white cursor-default"
      : "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"}
  `}
            onClick={() => handleJoinToggle(event._id,currentUser?.id || "")}
            disabled={isJoining || isLeaving}
          >
           {isJoined ? "Cancel" : "Join"}
          </button>
        ) : (
          <div className="flex gap-4 justify-between items-center w-full">
            <NavLink
              to={`/events/${event._id}/event-edit`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ✏️ Update
            </NavLink>

            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </footer>
    </article>
  );
};

export default EventItem;
