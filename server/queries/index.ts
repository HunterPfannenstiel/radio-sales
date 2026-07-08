import { BlobSearchBusinessesQuery } from "./SearchBusinessesQuery";
import { BlobDashboardQuery } from "./DashboardQuery";
import { BlobWhatsNextQuery } from "./WhatsNextQuery";
import { BlobRecentBusinessesQuery } from "./RecentBusinessesQuery";
import { BlobCallActivityQuery } from "./CallActivityQuery";
import { BlobBusinessInteractionHistoryQuery } from "./BusinessInteractionHistoryQuery";
import { BlobCurrentRepQuery } from "./CurrentRepQuery";
import { BlobRepGoalsQuery } from "./RepGoalsQuery";
import { BlobHealthCheckQuery } from "./HealthCheckQuery";

export const Queries = {
  searchBusinesses: new BlobSearchBusinessesQuery(),
  dashboard: new BlobDashboardQuery(),
  whatsNext: new BlobWhatsNextQuery(),
  recentBusinesses: new BlobRecentBusinessesQuery(),
  callActivity: new BlobCallActivityQuery(),
  businessInteractionHistory: new BlobBusinessInteractionHistoryQuery(),
  currentRep: new BlobCurrentRepQuery(),
  repGoals: new BlobRepGoalsQuery(),
  healthCheck: new BlobHealthCheckQuery(),
};