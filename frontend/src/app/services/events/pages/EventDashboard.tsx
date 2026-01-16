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
        <div className="space-y-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-500 text-center">
              My Events
            </h2>
            {myEvents && (
              <EventsList events={myEvents} emptyText="No events created yet" />
            )}
          </section>

          <section>
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
