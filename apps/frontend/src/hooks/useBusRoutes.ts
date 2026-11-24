import { busRouteService } from "../services/busRouteService";

import { useAsyncList } from "./useAsyncList";

// useBusRoutes hook
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