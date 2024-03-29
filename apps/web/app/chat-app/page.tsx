import React from "react";
import LogoutButton from "./_components/logout-button";
import ChatNavbar from "./_components/chat-navbar";

async function ChatAppHomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* <LogoutButton /> */}
      <ChatNavbar />
    </div>
  );
}

export default ChatAppHomePage;
