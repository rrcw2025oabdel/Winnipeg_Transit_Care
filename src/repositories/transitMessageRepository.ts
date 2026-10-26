let message =
  "Welcome aboard! Please keep your code behind the yellow line.";

const listeners = new Set<() => void>();

export const transitMessageRepository = {
  getMessage() {
    return message;
  },

  setMessage(value: string) {
    message = value;

    listeners.forEach(
      (listener) => listener()
    );
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};