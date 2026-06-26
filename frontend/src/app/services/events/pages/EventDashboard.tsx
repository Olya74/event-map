import EventsList from "../components/EventsList";
import { type IEvent } from "../../../models/IEvent";
import Loader from "../../../../components/loading/Loader";

type Props = {
  myEvents: IEvent[];
  joinedEvents: IEvent[];
  loading: boolean;
};

export default function EventsDashboard({
  myEvents,
  joinedEvents,
  loading,
}: Props) {

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
           <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-6  p-4 justify-center"> 
          <section >
            <h2 className="text-2xl font-semibold mb-4 text-gray-500 text-center">
              My Events
            </h2>
            {myEvents && (
              <EventsList events={myEvents} emptyText="No events created yet" />
            )}
          </section>

          <section >
            <h2 className="text-2xl font-semibold mb-4 text-gray-500 text-center">
              Joined Events
            </h2>
            {joinedEvents && (
              <EventsList events={joinedEvents} emptyText="No joined events" />
            )}
          </section>
        </div>
      )}
    </>
  );
}
