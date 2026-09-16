import Link from "next/link";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

const MainNavigation = () => {
  const { data: session } = useSession();

  const logoutHandler = async () => {
    await signOut();
  };

  return (
    <nav className="navbar">
      <ul className="flex mr-5 justify-evenly items-center md:justify-between space-x-2">
        <li className="brand">
          <Link href="/">Task Keeper</Link>
        </li>
        {session && (
          <li onClick={logoutHandler} className="btn-logout">
            <AiOutlineLogout className="inline mr-1" />
            logout
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MainNavigation;
