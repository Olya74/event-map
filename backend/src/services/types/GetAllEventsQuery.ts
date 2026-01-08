import e from "express";

interface GetAllEventsQuery {
  page: number;
  limit: number;
  sortDirection: "asc" | "desc";
  sortBy: string;
}


export default GetAllEventsQuery;