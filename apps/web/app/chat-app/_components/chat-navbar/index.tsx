import React from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { PiChatsTeardrop } from "react-icons/pi";

function ChatNavbar() {
  return (
    <Navbar isBordered>
      <NavbarBrand className="gap-3">
        <PiChatsTeardrop size={28} />
        <p className="font-bold text-inherit text-xl">Chats</p>
      </NavbarBrand>
    </Navbar>
  );
}

export default ChatNavbar;
