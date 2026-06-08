# API

This directory houses all of the API routes.

## Standards
* File based routing via Route Handlers
* All routes must use zod for input validation
* A route should never access persisted data directly
* All access control must go through the `Roles` static class (server/roles/Roles.ts)

### GET Routes
* Must execute a query defined in server/queries for its response

### Mutation Routes
* Must execute a mutation defined in server/mutations for its business logic