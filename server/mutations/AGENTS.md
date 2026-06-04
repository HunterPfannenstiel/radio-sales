# Mutations

* There will be one file per mutation, all accumulated into one object that gets exported from /index.ts
* A mutation file should perform the following:
    * Define the mutation payload
    * Define the mutation interface
    * Implement the interface using the blob library (lib/blob)

Example File `CreateLeagueMutation.ts`

```ts
export type CreateLeaguePayload = {
    commissionerId: string;
    name: string;
    placementPoints: number[];
    mulliganCount: number;
    scoringDepth?: number;
    stageCount?: number;
    propPointValues: PropPointValues;
    motorsportId: string;
}

export interface ICreateLeagueMutation {
  execute(payload: CreateLeaguePayload): Promise<void>;
}

export class BlobCreateLeagueMutation implements ICreateLeagueMutation {
    async execute(payload: CreateLeaguePayload): Promise<void> {
        // implementation using IBlobStore
    }
}
```