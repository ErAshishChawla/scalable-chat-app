import React from "react";

interface ChatAppLayoutProps {
  children: React.ReactNode;
}

function ChatAppLayout({ children }: ChatAppLayoutProps) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}

export default ChatAppLayout;
