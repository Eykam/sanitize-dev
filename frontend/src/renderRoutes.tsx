import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";

const RenderRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <Routes>
      {routes.map((currRoute) => {
        if (currRoute.isPrivate && isAuthenticated) {
          return (
            <Route
              key={currRoute.name}
              path={currRoute.path}
              element={currRoute.element}
            />
          );
        } else if (!currRoute.isPrivate) {
          return (
            <Route
              key={currRoute.name}
              path={currRoute.path}
              element={currRoute.element}
            />
          );
        } else {
          return false;
        }
      })}
    </Routes>
  );
};

export default RenderRoutes;
