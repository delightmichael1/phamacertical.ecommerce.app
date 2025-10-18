import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { immer } from "zustand/middleware/immer";

interface SocketStoreState {
  disconnect: () => void;
  socket: Socket | undefined;
  connect: (userId: string, identifier: string) => void;
}

export const useSocketState = create<SocketStoreState>()(
  immer((set, get) => ({
    socket: undefined,
    disconnect: () => {
      const socket = get().socket;
      if (socket) {
        socket.disconnect();
        set({ socket: undefined });
      }
    },
    connect: (userId, identifier) => {
      const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        autoConnect: true,
        extraHeaders: {
          "X-User-Id": userId,
          "X-Device-Id": identifier,
          "X-Platform": "retailer",
        },
      });

      socket.on("connect", () => {
        console.log("Socket Connected: ", userId ?? undefined);
        socket.emit("homepage:stats");
      });

      socket.on("disconnect", () =>
        console.log("Socket Disconnected: ", userId ?? undefined)
      );

      set({ socket: socket });
    },
  }))
);
