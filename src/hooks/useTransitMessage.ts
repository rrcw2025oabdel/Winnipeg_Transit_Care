import { useSyncExternalStore } from "react";

import { transitMessageService } from "../services/transitMessageService";

// useTransitMessage hook
export function useTransitMessage() {
  const transitMessage =
    useSyncExternalStore(
      transitMessageService.subscribe,
      transitMessageService.getMessage,
      transitMessageService.getMessage
    );

  return {
    transitMessage,
    setTransitMessage:
      transitMessageService.setMessage,
  };
}