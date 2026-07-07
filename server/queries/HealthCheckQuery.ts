import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";

export type HealthCheckDTO = {
  status: "ok" | "error";
  storage: "ok" | "error";
};

export interface IHealthCheckQuery {
  execute(): Promise<HealthCheckDTO>;
}

export class BlobHealthCheckQuery implements IHealthCheckQuery {
  async execute(): Promise<HealthCheckDTO> {
    try {
      await blob.read(paths.repsIndex);
      return { status: "ok", storage: "ok" };
    } catch {
      return { status: "error", storage: "error" };
    }
  }
}
