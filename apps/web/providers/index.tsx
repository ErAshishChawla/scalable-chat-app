"use client";

import React from "react";

import NextUiProvider from "./nextui-provider";
import { ChatAppStoreProvider } from "./chat-app-store-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <>
      <NextUiProvider>
        <ChatAppStoreProvider>{children}</ChatAppStoreProvider>
      </NextUiProvider>
    </>
  );
}

export default Providers;
