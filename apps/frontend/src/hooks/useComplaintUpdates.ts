import { useCallback } from "react";

import type { ComplaintUpdate } from "../types/complaintUpdate";

import { complaintUpdateService } from "../services/complaintUpdateService";

import { useAsyncList } from "./useAsyncList";

/**
 * Returns:
 * - updates: feedback linked to the user's complaints.
 * - loading: whether feedback is being loaded.
 * - error: the latest loading error.
 *
 * Business rules and data access are delegated to
 * the service and repositories.
 */
export function useComplaintUpdates(userId: number) {
  const load = useCallback(
    () => complaintUpdateService.getForUser(userId),
    [userId]
  );

  const {
    records,
    loading,
    error,
  } = useAsyncList<ComplaintUpdate>(
    load,
    complaintUpdateService.subscribe
  );

  return {
    updates: records,
    loading,
    error,
  };
}