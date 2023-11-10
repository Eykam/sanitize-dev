import React from "react";
import Description from "./components/description";
import FAQ from "./components/faq";

const Home = () => {
  const checkMobile = () => {
    return window.innerWidth < 1200;
  };
  return (
    <div
      id="landing-page"
      style={{ justifyContent: "center", margin: checkMobile() ? "10%" : "0" }}
    >
      <Description />
      <FAQ />
    </div>
  );
};

export default Home;
