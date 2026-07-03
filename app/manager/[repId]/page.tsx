"use client";

import { useParams } from "next/navigation";
import { DrillDown } from "./DrillDown";

export default function ManagerDrillDownPage() {
  const params = useParams<{ repId: string }>();
  return <DrillDown repId={params.repId} />;
}
