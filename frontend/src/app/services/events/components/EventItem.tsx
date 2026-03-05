import type { FC } from "react";
import type { IEvent } from "../../../models/IEvent";
import { NavLink } from "react-router-dom";
import { useDeleteEventMutation, useJoinEventMutation,useLeaveEventMutation, useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation
 } from "../EventService";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const isSubscribed = event.isSubscribed;

  const [subscribeToEvent, { isLoading: isSubscribing }] = useSubscribeToEventMutation();




useEffect(() => {
    if (!errorMsg && !successMsg) return;
    const timer = setTimeout(() => {
      setErrorMsg(null);
      setSuccessMsg(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [errorMsg, successMsg]);

  const handleUnsubscribeFromEvent = async (eventId: string,userId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
     navigate("/unsubscribe");
  }
 
  const handleSubscribe = async (id: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if(!id) return;
    try {
      const res = await subscribeToEvent(id).unwrap();
      setSuccessMsg(res.message);
      
    } catch (err: any) {
      setErrorMsg(getErrorMessage(err, "Failed to update subscription."));
    } 
  };

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
    <article className="max-w-2xl mx-auto w-full  bg-gray-200 rounded-2xl shadow-md p-6 flex flex-col transition hover:shadow-lg">
      {/* FEEDBACK */}
      {errorMsg && <ErrorMessage error={errorMsg} />}
      {successMsg && <Success success={successMsg} />}
      {/* HEADER */}
      <header className="mb-3 text-center h-25 mt-4">
        <h2 className="font-bold   text-gray-700 text-xl md:text-3xl">
          {event.title}
        </h2>
        <p className="text-blue-600 text-md mt-2 md:text-xl">
          {nullBeforeDate(event.date)}
        </p>
      </header>

      {/* DESCRIPTION */}
      <section className="mb-4 flex-1 text-sm md:text-xl">
      <p className="text-gray-700 leading-relaxed line-clamp-3 mb-4">
        {event.description}
      </p>
      </section>
      {/* INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] justify-stretch gap-3 text-sm  text-gray-600 mb-4 md:text-xl items-start">
        <p>
          <span className="font-semibold">GPS:</span>{" "}
          <span className="font-mono">{event.location.lat.toFixed(2)}, {event.location.lng.toFixed(2)}</span>
        </p>
       
        <p className="break-words pb-1 pl-4">
          <span className="font-semibold">Address:</span>{" "}
          <span className="">{event.address?.street !== "Not specified" && event.address?.street}{" "}
          {event.address?.number !== "Not specified" && event.address?.number}{" "}</span>
             <span className="block">{event.address?.zip !== "Not specified" && event.address?.zip} Berlin</span>
        </p>
     
     
      </div>

      {/* MEDIA */}
      {event.media?.length > 0 && (
        <div className="rounded-xl  overflow-hidden mb-4 ">
          <img
            src={event.media[0].url}
            alt={event.title}
           className="w-full aspect-video object-cover object-center"
            
            loading="lazy"
          />
        </div>
      )}

      {/* ACTIONS */}
      <footer className="mt-auto pt-4 border-t border-gray-600 flex justify-between items-center h-28 ">
        {!isOwner ? (
          <div className="flex gap-4 justify-between items-center w-full">
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
          <div className="flex flex-wrap gap-1 justify-end mt-2  items-center w-48">
           <button
  className="bg-green-600 py-2 px-4 truncate rounded-md text-white hover:bg-green-800 transition min-w-48"
  onClick={() =>
    isSubscribed
      ? navigate(`/unsubscribe?eventId=${event._id}`)
      : handleSubscribe(event._id)
  }
>
      {isSubscribed ? "🔔 subscribed " : "subscribe"}
</button>
{!currentUser?.notification_settings.email_notifications && <button  className="bg-green-600 px-4 py-2 truncate rounded-md text-white hover:bg-green-800 transition hover:text-wrap hover:text-left" onClick={() => navigate("/profile/notifications")}
 >✉ enable notification</button>}
              </div>
             </div>
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
