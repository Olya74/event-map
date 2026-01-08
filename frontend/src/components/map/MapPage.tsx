import { useState } from "react";
import Map from "./Map";
import "./map.css";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import type { Position } from "../../app/models/location-types";

function MapPage() {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position | null>(null);
  const [show, setShow] = useState<boolean>(true);
  const handleNavigateToCreateEvent = () => {
    navigate("/events/create-event", {
      state: {
        lat: position?.lat ?? null,
        lng: position?.lng ?? null,
      },
    });
  };

  return (
    <div className="relative h-[calc(100vh-150px)] w-full">
      <button
        onClick={() => setShow(!show)}
        className="absolute z-[1001] top-[-15px] left-1/2 -translate-x-1/2 bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md shadow transition text-lg"
      >
        {show ? "Hide Info" : "Show Info"}
      </button>
      {/* FLOATING INFO PANEL */}
      {show && (
        <div
          className="
          absolute top-4 left-1/2 -translate-x-1/2 z-[1000]
          bg-white/100 backdrop-blur
          shadow-lg rounded-2xl
          px-6 py-2
          w-[90%] max-w-xl
          text-center
        "
        >
          <h1 className="text-xl sm:text-3xl font-semibold mb-1">
            📍 Events in Berlin
          </h1>

          <p className="text-gray-700 text-sm sm:text-2xl font-medium">
            Click on the map to select a position
          </p>

          <p className="mt-1 text-emerald-600 font-mono text-lg">
            {position
              ? `Lat: ${position.lat}, Lng: ${position.lng}`
              : "No position selected"}
          </p>

          <p className="mt-1 text-lg text-gray-500">
            Click on the <span className="text-yellow-500 font-bold">★</span> to
            read event details
          </p>

          <button
            onClick={handleNavigateToCreateEvent}
            className="
            mt-3
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            py-2 px-6
            rounded-lg shadow
            transition
            text-lg
          "
          >
            ➕ Create event
          </button>
        </div>
      )}
      {/* MAP */}
      <Map position={position} setPosition={setPosition} />
    </div>
  );
}

export default MapPage;
