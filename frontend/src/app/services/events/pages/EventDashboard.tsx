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
        <div className="space-y-8">
          <section >
            {myEvents && (
              <EventsList events={myEvents} emptyText="No events created yet" />
            )}
          </section>

          <section >
            {joinedEvents && (
              <EventsList events={joinedEvents} emptyText="No joined events" />
            )}
          </section>
        </div>
      )}
    </>
  );
}
