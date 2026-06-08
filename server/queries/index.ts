import { BlobSearchBusinessesQuery } from "./SearchBusinessesQuery";
import { BlobDashboardQuery } from "./DashboardQuery";

export const Queries = {
  searchBusinesses: new BlobSearchBusinessesQuery(),
  dashboard: new BlobDashboardQuery(),
};