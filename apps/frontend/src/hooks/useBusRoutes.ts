import { busRouteService } from "../services/busRouteService";

import { useAsyncList } from "./useAsyncList";

/**
 * Returns:
 * - routes: shared route records
 * - loading: whether the latest request is pending
 * - error: the latest loading error or an empty string
 * 
 * The hook manages presentation lifecycle.
 * Business rules and data access remain in service and repository
 */
export function useBusRoutes() {
  const {
    records,
    loading,
    error,
  } = useAsyncList(
    busRouteService.getAll,
    busRouteService.subscribe
  );

  return {
    routes: records,
    loading,
    error,
  };
}