import React from "react";
import AppEntry from "./scenes/app/index";
import Home from "./scenes/home/index";
import Login from "./scenes/login/login";
import Profile from "./scenes/user/profile";

export const routes = [
  { path: "/", name: "Home", element: <Home />, isPrivate: false },
  { path: "/app", name: "App", element: <AppEntry />, isPrivate: true },
  { path: "/login", name: "Login", element: <Login />, isPrivate: false },
  { path: "/profile", name: "Profile", element: <Profile />, isPrivate: true },
  { path: "*", name: "Error", element: <Login />, isPrivate: false },
];
