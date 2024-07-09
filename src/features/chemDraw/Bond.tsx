import React, { useState } from "react";
import { Group, Line, Rect } from "react-konva";
import { BondType, updateBond } from "./utils/bond";

type Props = {
  to: { x: number; y: number };
  from: { x: number; y: number };
  bondType?: BondType;
  id: string;
  onUpdateBond: (id: string, newbond: BondType) => void;
};

export default function Bond({ to, from, bondType, id, onUpdateBond }: Props) {
  const handleDblClick = () => {
    let newbond = bondType;
    if (bondType === BondType.Single) {
      newbond = BondType.Double;
    } else if (bondType === BondType.Double) {
      newbond = BondType.Triple;
    } else {
      newbond = BondType.Single;
    }
    onUpdateBond(id, newbond);
  };

  const bonds = updateBond(from, to, bondType);
  return (
    <Group
      onDblClick={handleDblClick}
      key={id}
      onMouseEnter={(e: any) => {
        e.target.getStage().container().style.cursor = "pointer";
      }}
      onMouseleave={(e: any) => {
        e.target.getStage().container().style.cursor = "default";
      }}
    >
      {bonds.map((b, index) => {
        return (
          <>
            <Line
              key={index}
              points={[b.from.x, b.from.y, b.to.x, b.to.y]}
              stroke="black"
              opacity={b.opacity}
            />
            {/* {selectedBond === id && (
              <Rect
                x={Math.min(b.from.x, b.to.x) - 5}
                y={Math.min(b.from.y, b.to.y) - 5}
                width={Math.abs(b.to.x - b.from.x) + 10}
                height={Math.abs(b.to.y - b.from.y) + 10}
                stroke="red"
                strokeWidth={2}
              />
            )} */}
          </>
        );
      })}
    </Group>
  );
}
