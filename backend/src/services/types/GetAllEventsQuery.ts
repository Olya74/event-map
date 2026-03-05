

interface GetAllEventsQuery {
  page: number;
  limit: number;
  sortDirection: "asc" | "desc";
  sortBy: string;
  fromDate?: string;
}


export default GetAllEventsQuery;