import { BlobSearchBusinessesQuery } from "./SearchBusinessesQuery";
import { BlobDashboardQuery } from "./DashboardQuery";
import { BlobWhatsNextQuery } from "./WhatsNextQuery";
import { BlobRecentBusinessesQuery } from "./RecentBusinessesQuery";
import { BlobCallActivityQuery } from "./CallActivityQuery";

export const Queries = {
  searchBusinesses: new BlobSearchBusinessesQuery(),
  dashboard: new BlobDashboardQuery(),
  whatsNext: new BlobWhatsNextQuery(),
  recentBusinesses: new BlobRecentBusinessesQuery(),
  callActivity: new BlobCallActivityQuery(),
};