import { useCallback } from "react";

import { complaintService } from "../services/complaintService";

import { useAsyncList } from "./useAsyncList";

// useComplaints hook
export function useComplaints(
  userId: number
) {
  const load = useCallback(
    () =>
      complaintService.getForUser(
        userId
      ),
    [userId]
  );

  const {
    records,
    loading,
    error,
  } = useAsyncList(
    load,
    complaintService.subscribe
  );

  return {
    complaints: records,
    loading,
    error,
  };
}