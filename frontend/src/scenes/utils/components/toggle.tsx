import React, { PropsWithChildren } from "react";
import { useAppSelector } from "../../../store/store";

interface Props {
  id: string;
}

const Toggle = ({ id, children }: PropsWithChildren<Props>) => {
  const show = useAppSelector((state) => state.form[id]);
  return <>{show ? children : null}</>;
};

export default Toggle;
