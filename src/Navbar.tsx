import "./navbar.css";
import appLogo from "./assets/SVG/appLogo.svg";
// import burgerMenu from "./assets/SVG/burgerMenu.svg";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import React from "react";

export function Navbar() {
  const location = useLocation();

  return (
    <div className="wrapper flex justify-between h-14 w-full bg-slate-900">
      <div className=" logoWrapper flex w-full ">
        <img src={appLogo} alt="h-max" className="p-1" />
        <div className="listWrapper flex flex-row w-fit bg-slate-900 text-white">
          <Link to="/">
            <div
              className={
                location.pathname === "/"
                  ? " hover:bg-slate-500 w-full h-full pr-10 pl-10 flex items-center bg-slate-500"
                  : " hover:bg-slate-500 w-full h-full pr-10 pl-10 flex items-center"
              }
            >
              Markets
            </div>{" "}
          </Link>
          <Link to="/assets">
            <div className={
                location.pathname.includes("asset")
                  ? " hover:bg-slate-500 w-full h-full pr-10 pl-10 flex items-center bg-slate-500"
                  : " hover:bg-slate-500 w-full h-full pr-10 pl-10 flex items-center"
              }>
              Base Assets
            </div>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
