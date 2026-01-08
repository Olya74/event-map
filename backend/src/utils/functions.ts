import fetch from "node-fetch";
import AddressType from "../models/AddressType.js";

interface NominatimResult {
  lat: string; // приходит строкой
  lon: string; // приходит строкой
  display_name?: string;
}
type AddressInput = AddressType | string;

export async function geocodeAddress(address: AddressInput) {
  // const query = `${address.street ?? ""} ${address.number ?? ""}, ${address.zip ?? ""}, ${address.city}, ${address.country}`;
  const query =
    typeof address === "string"
      ? address
      : `${address.street} ${address.number ?? ""}, ${address.zip}, ${
          address.city
        }, ${address.country}`;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "events-map",
    },
  });

  const data = (await response.json()) as NominatimResult[];

  if (!data.length) {
    throw new Error("Address not found");
  }

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
  };
}
