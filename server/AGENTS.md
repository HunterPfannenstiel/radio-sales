# Server

This directory stores all of the functionality necessary to perform actions on the server. Very minimal server-side code should be written outside of this directory.

# Phase 0 - **Extreme Prototyping**
* No Domain Driven Design; instead, the following concepts will be used:

* Queries (/queries)
    * All GET routes will execute a query to fulfill their contract

* Mutations (/mutations)
    * All mutation routes will execute a mutation to fulfill their purpose

* AppPermissions (/permissions)
    * All routes that need access control will reference this static class