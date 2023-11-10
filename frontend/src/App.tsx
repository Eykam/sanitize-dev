import "./css/App.css";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./store/store";
import { checkLoggedIn } from "./store/features/userSlice";
import { BrowserRouter } from "react-router-dom";

import Header from "./scenes/utils/components/header";
import Footer from "./scenes/utils/components/footer";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import RenderRoutes from "./renderRoutes";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.userDetails);

  console.log("App Re-Render");

  useEffect(() => {
    if (!user) {
      dispatch(checkLoggedIn(null));
    }
  }, [user, dispatch]);

  return (
    <div
      className="App"
      style={{
        minWidth: "100%",
        maxWidth: "100%",
        height: "100%",
      }}
    >
      <BrowserRouter>
        <Header />

        <div
          id="body-div"
          style={{ flexDirection: "column", justifyContent: "space-between" }}
        >
          <RenderRoutes isAuthenticated={user ? true : false} />

          <Footer />
          <></>
        </div>

        <div className="bg"></div>
      </BrowserRouter>
    </div>
  );
};

export default App;
