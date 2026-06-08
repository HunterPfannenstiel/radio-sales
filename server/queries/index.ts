import { BlobSearchBusinessesQuery } from "./SearchBusinessesQuery";
import { BlobDashboardQuery } from "./DashboardQuery";
import { BlobWhatsNextQuery } from "./WhatsNextQuery";

export const Queries = {
  searchBusinesses: new BlobSearchBusinessesQuery(),
  dashboard: new BlobDashboardQuery(),
  whatsNext: new BlobWhatsNextQuery(),
};