"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useState,
  useEffect,
} from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type ChatAppStore,
  createChatAppStore,
} from "../stores/chat-app-store";
import { apiInstance } from "../lib/api-instance";

export const ChatAppStoreContext = createContext<StoreApi<ChatAppStore> | null>(
  null
);

export interface ChatAppStoreProviderProps {
  children: ReactNode;
}

export const ChatAppStoreProvider = ({
  children,
}: ChatAppStoreProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    // const fetchUser = async () => {
    //   try {
    //     storeRef.current?.setState((state) => ({
    //       ...state,
    //       loadingState: { ...state.loadingState, isFetching: true },
    //     }));

    //     const response = await apiInstance.get("/user");
    //   } catch (error) {
    //     console.error(error);

    //   }
    // };
  }, [isMounted]);

  const storeRef = useRef<StoreApi<ChatAppStore>>();
  if (!storeRef.current) {
    storeRef.current = createChatAppStore();
  }

  return (
    <ChatAppStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatAppStoreContext.Provider>
  );
};

export const useCounterStore = <T,>(
  selector: (store: ChatAppStore) => T
): T => {
  const chatAppStoreContext = useContext(ChatAppStoreContext);

  if (!chatAppStoreContext) {
    throw new Error(`useCounterStore must be use within ChatAppStoreProvider`);
  }

  return useStore(chatAppStoreContext, selector);
};
