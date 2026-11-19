import {
  useEffect,
  useState,
} from "react";

type Subscribe = (
  listener: () => void
) => () => void;

// hook to manage an async list of records with loading and error states
export function useAsyncList<T>(
  load: () => Promise<T[]>,
  subscribe: Subscribe
) {
  const [records, setRecords] =
    useState<T[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    async function refresh() {
      const requestId =
        ++latestRequest;

      setLoading(true);

      try {
        const result = await load();

        if (
          active &&
          requestId === latestRequest
        ) {
          setRecords(result);
          setError("");
        }
      } catch (cause) {
        if (
          active &&
          requestId === latestRequest
        ) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load records."
          );
        }
      } finally {
        if (
          active &&
          requestId === latestRequest
        ) {
          setLoading(false);
        }
      }
    }
// Subscribe to changes and refresh the list when notified.
    const unsubscribe = subscribe(() => {
      void refresh();
    });

    void refresh();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [load, subscribe]);

  return {
    records,
    loading,
    error,
  };
}