import React from "react";
import { RequestHistory } from "../../store/features/userSlice";

const ListItem = ({
  data,
  index,
}: {
  data: RequestHistory[];
  index: number;
}) => {
  const curr = data[index];

  return (
    <div
      className="word-shell"
      style={{
        display: "flex",
        padding: "0.5%",
      }}
      id={curr + "-outer"}
      key={curr + "-outer"}
    >
      <div
        className="collapsible"
        id={curr + "-collapsible"}
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "auto 0",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "100%",
          }}
        >
          <span
            style={{
              display: "inline-block",
              margin: "auto 0",
              width: "25%",
              color: "rgb(200,200,200)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <b> Filename: </b> {curr.filename}
          </span>

          <span
            style={{
              display: "inline-block",
              margin: "auto 0",
              width: "25%",
              marginLeft: "auto",
              color: "rgb(200,200,200)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <b> Size: </b>
            {curr.size}MB
          </span>

          <span
            style={{
              display: "inline-block",
              margin: "auto 0",
              marginLeft: "auto",
              width: "25%",
              color: "rgb(186, 125, 125)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontWeight: "bolder",
            }}
          >
            <span style={{ color: "rgb(200,200,200)" }}> Cost: </span> -
            {Math.round(curr.size)}
          </span>

          <span
            style={{
              display: "inline-block",
              margin: "auto 0",
              width: "25%",
              marginLeft: "auto",
              color: "rgb(200,200,200)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <b> Timestamp: </b>
            {curr.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
