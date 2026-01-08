import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { type LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGetAllEventsQuery } from "../../app/services/events/EventService";
import { myIcon } from "./myIcon";

interface MapProps {
  position: LatLngLiteral | null;
  setPosition: (pos: LatLngLiteral) => void;
}

interface LocationMarkerProps {
  position: LatLngLiteral | null;
  setPosition: (pos: LatLngLiteral) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e: { latlng: LatLngLiteral }) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function Map({ position, setPosition }: MapProps) {
  const { data: eventsData } = useGetAllEventsQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  return (
    <MapContainer
      center={[52.4847302, 13.3914367]}
      zoom={16}
      className="w-full h-[100%] rounded-md shadow"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} />
      {eventsData &&
        eventsData.map((event) =>
          event.location ? (
            <Marker
              key={event._id}
              position={[event.location.lat, event.location.lng]}
              icon={myIcon}
            >
              <Popup>
                <strong>{event.title}</strong>
                <br />
                {event.description}
              </Popup>
            </Marker>
          ) : null
        )}
    </MapContainer>
  );
}
