import React, { useCallback, useMemo, useState } from "react";
import { Group, Line, Rect, Shape } from "react-konva";
import {
  BondLength,
  BondType,
  calculateTriangleVertices,
  regularBonds,
  TriangleWidth,
  updateBond,
} from "./utils/bond";

type Props = {
  to: { x: number; y: number };
  from: { x: number; y: number };
  bondType?: BondType;
  id: string;
  selected?: boolean;
  onUpdateBond?: (id: string, newbond: BondType) => void;
};

export default function Bond({
  to,
  from,
  bondType,
  id,
  onUpdateBond,
  selected,
}: Props) {
  const isRegularBond = regularBonds.includes(bondType as BondType);
  const handleDblClick = useCallback(() => {
    let newbond = bondType;
    if (isRegularBond) {
      if (bondType === BondType.Single) {
        newbond = BondType.Double;
      } else if (bondType === BondType.Double) {
        newbond = BondType.Triple;
      } else {
        newbond = BondType.Single;
      }
    } else {
      if (bondType === BondType.Front) {
        newbond = BondType.Back;
      } else if (bondType === BondType.Back) {
        newbond = BondType.Front;
      }
    }
    if (onUpdateBond && newbond) {
      onUpdateBond(id, newbond);
    }
  }, [bondType, id, isRegularBond, onUpdateBond]);

  const bonds = updateBond(from, to, bondType);

  const renderRegularBonds = useMemo(() => {
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
                stroke={selected ? "red" : "black"}
                opacity={b.opacity}
              />
              {/* {selected && (
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
  }, [bonds, handleDblClick, id, selected]);

  const renderTriangles = useMemo(() => {
    const { A, B, C } = calculateTriangleVertices(from, to);
    return (
      <Shape
        onMouseEnter={(e: any) => {
          e.target.getStage().container().style.cursor = "pointer";
        }}
        onMouseleave={(e: any) => {
          e.target.getStage().container().style.cursor = "default";
        }}
        onDblClick={handleDblClick}
        width={TriangleWidth}
        height={BondLength}
        sceneFunc={function (context: any, shape: any) {
          // const width = shape.width();
          // const height = shape.height();
          context.beginPath();
          context.moveTo(A.x, A.y);
          context.lineTo(B.x, B.y);
          context.lineTo(C.x, C.y);
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
        fill={bondType === BondType.Front ? "#00D2FF" : "white"}
        stroke="black"
        strokeWidth={1}
      />
    );
  }, [bondType, from, handleDblClick, to]);
  return (
    <>
      {isRegularBond && renderRegularBonds}
      {!isRegularBond && renderTriangles}
    </>
  );
}
