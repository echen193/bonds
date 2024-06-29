import React from "react";
import { Group, Circle } from "react-konva";
import { BondType, updateBond } from "./utils/bond";

type Props = {
  key: string;
  x: number;
  y: number;
  label?: string;
};

export default function BondNode({ key, x, y }: Props) {
  return <Circle key={key} x={x} y={y} radius={10} fill="blue" />;
}
