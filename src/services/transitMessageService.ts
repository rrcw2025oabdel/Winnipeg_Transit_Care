import { transitMessageRepository } from "../repositories/transitMessageRepository";

// Transit message service
export const transitMessageService = {
  getMessage:
    transitMessageRepository.getMessage,

  subscribe:
    transitMessageRepository.subscribe,

  setMessage(message: string) {
    if (!message.trim()) {
      throw new Error(
        "Transit message cannot be empty."
      );
    }

    transitMessageRepository.setMessage(
      message.trim()
    );
  },
};