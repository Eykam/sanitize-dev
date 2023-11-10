import "../css/BarLoader.css";
import React from "react";

const Loading = (loaderId: { loaderId: string }) => {
  return (
    <div
      id={"loading-" + loaderId.loaderId}
      className="boxDiv"
      style={{ margin: "0 auto", marginBottom: "10%" }}
    >
      <div className="boxContainer">
        <div className="box box1"></div>
        <div className="box box2"></div>
        <div className="box box3"></div>
        <div className="box box4"></div>
        <div className="box box5"></div>
      </div>
    </div>
  );
};

export default Loading;
