import { createStore } from "zustand/vanilla";

export type ChatAppState = {
  loadingState: {
    isFetching: boolean;
    isFetched: boolean;
    isError: boolean;
    isSuccess: boolean;
  };

  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };

  timezone: string;
};

export type ChatAppActions = {
  setLoadingState: (loadingState: ChatAppState["loadingState"]) => void;
  setUser: (user: ChatAppState["user"]) => void;
};

export type ChatAppStore = ChatAppState & ChatAppActions;

export const defaultChatAppState: ChatAppState = {
  loadingState: {
    isFetching: false,
    isFetched: false,
    isError: false,
    isSuccess: false,
  },

  user: {
    id: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
  },

  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};

export const createChatAppStore = (
  initState: ChatAppState = defaultChatAppState
) => {
  return createStore<ChatAppStore>()((set) => ({
    ...initState,
    setLoadingState: (loadingState: ChatAppState["loadingState"]) =>
      set((state) => {
        return { ...state, loadingState };
      }),

    setUser: (userState: ChatAppState["user"]) =>
      set((state) => ({
        ...state,
        user: userState,
      })),
  }));
};
