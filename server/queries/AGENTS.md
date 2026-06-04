# Queries

* There will be one file per query, all accumulated into one object that gets exported from /index.ts
* A query file should perform the following:
    * Define the query DTOs
    * Define the query interface
    * Implement the interface using the blob library (lib/blob)

Example file `ICommissionerTeamsQuery.ts`

```ts
export type CommissionerTeamDTO = {
  id: string;
  name: string;
  color?: string;
  memberIds: string[];
};

export type CommissionerUserDTO = {
  id: string;
  name: string;
};

export type CommissionerTeamsResult = {
  teams: CommissionerTeamDTO[];
  users: CommissionerUserDTO[];
};

export interface ICommissionerTeamsQuery {
  execute(leagueId: string): Promise<CommissionerTeamsResult>;
}

export class BlobCommissionerTeamsQuery implements ICommissionerTeamsQuery {
  async execute(leagueId: string): Promise<CommissionerTeamsResult> {
    // implementation using IBlobStore
  }
}
```
