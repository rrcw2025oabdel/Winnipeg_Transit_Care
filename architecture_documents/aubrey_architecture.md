# Architecture Layout - Aubrey Fernandez(AF)

This document explains the hookes, services, and repositories I contributed and how they fit into the overall project

Resource: BusRoutes 


## 1. What does this hook/service/repository do?

### busRouteRepository 
`src/repositories/busRouteRepository.ts`

This imports data from 'src/data/busRoutes.testData.ts' and shows the CRUD methods(`getAll`, `getById`, `create`, `update`, `delete`)

### busRouteService 
`src/services/busRouteService.ts`

This holds the businesses rules for bus routes. 
`getRoutes` reads through the repository
`save` validates then creates or updates a route, mapping form input into a `BusRoute` with 3 default stops
`delete`, `validateForm` (required fields, duplicate route number, time format), 
`filterByNeighbourhood` sorts the routes by neighbourhood
`sortByFavourites`allows to sort by favourites

### useBusRoutes

`src/hooks/useBusRoutes.ts`

It is the presentation-layer entry point for bus routes. It fetches routes on mount via the service
subscribes to repository changes, and holds presentation state: `form`, `editingId`, `saving`, `error`, `loading`. 
It returns the route list (already filtered/sorted by the service), the neighbourhood options, 
and handlers: `handleChange`, `editRoute`, `clearForm`, `saveRoute`, `deleteRoute`.


## 2. How did you decide what logic to include, and how does that separate solution concerns?

### busRouteRepository 
`src/repositories/busRouteRepository.ts`

The repository should be the only layer that touches raw data so it is tasked with CRUD
Create: Creating new routes
Read: Reading the routes
Update: Updating/changing the routes
Delete: Removing the routes

Because this layer is tasked with handling raw data, things like validation, filter and sorting and mapping 
are left out and put in service and hooks. 

### busRouteService 
`src/services/busRouteService.ts`

Business rules go here, so if it included this like validation, mapping, filtering or sorting it was put here. 
The service is used to call the repository public methods which means ever user that uses that app will deal 
with the same rules. If rules need to be changed, you only need to change this file. 

### useBusRoutes

`src/hooks/useBusRoutes.ts`

The hook connects the UI to the service 

The hook owns state the UI needs to re-render, and nothing else. Included: `useState`/`useEffect` for loading, form values, editing id, saving, and error; the subscribe/unsubscribe lifecycle. Excluded: business rules (delegated to `busRouteService`) and data access (also delegated to the service). The hook never imports the repository and never validates the form. This keeps presentation logic reusable across components without duplicating rules.

## 3. Where is this implementation made use of in the project and how?

## busRouteRepository

`src/repositories/busRouteRepository.ts`

- Used by `src/services/busRouteService.ts` — every read/write of routes goes through this repository.
- Used indirectly by `src/hooks/useBusRoutes.ts` (calls the service) and `src/components/BusRoutes.tsx` (calls the hook).
- Used indirectly by the Complaints pages (owned by `Abdel`), which query routes via `useBusRoutes` — making this repository the shared source of truth across pages 

## busRouteService

`src/services/busRouteService.ts`
- Used by `src/hooks/useBusRoutes.ts` — the hook calls `getRoutes`, `save`, `delete`, `filterByNeighbourhood`, and `sortByFavourites`.
- Used indirectly by `src/components/BusRoutes.tsx` and the Complaints pages via the hook, so both pages get the same filtered/sorted route lists and the same validation.

## useBusRoutes

`src/hooks/useBusRoutes.ts`
- Used by `src/components/BusRoutes.tsx` to get `routes`, `loading`, `error`, form state, and CRUD handlers.
