import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CurrentIP } from "~~/components/example-ui/GeoIP/CurrentIP";;
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon, ServerStackIcon, GlobeEuropeAfricaIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary shadow-md" : ""
      } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const hostInfo = useSelector(state => state.host);
  const { address } = useAccount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const navLinks = () => {
    if (address) {
      return (
        <>
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          {/* <li>
            <NavLink href="/debug">
              <BugAntIcon className="h-4 w-4" />
              Debug Contracts
            </NavLink>
          </li> */}
          {hostInfo && (
            <li>
              <NavLink href="/host">
                <ServerStackIcon className="h-4 w-4" />
                Host
              </NavLink>
            </li>
          )}
          <li>
            <NavLink href="/example-ui">
              <GlobeEuropeAfricaIcon className="h-4 w-4" />
              Client
            </NavLink>
          </li>
          {/* <li>
            <NavLink href="/blockexplorer">
              <MagnifyingGlassIcon className="h-4 w-4" />
              Block Explorer
            </NavLink>
          </li> */}
        </>
      );
    }
  };

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks()}
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="https://avatars.githubusercontent.com/u/145208723?s=400&u=6eae4ca3fa1df85d277958c826ed152e8ed15064&v=4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Skypiea</span>
            <span className="text-xs">Infrastructure solution</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks()}</ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <CurrentIP />
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
