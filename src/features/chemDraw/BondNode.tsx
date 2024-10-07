import React, { useState } from "react";
import { Group, Circle, Text } from "react-konva";
import { BondType, updateBond } from "./utils/bond";
import EditableTextInput from "./components/EditableTextInput";
import { Actions } from "./actions";
import { Node } from "./DrawingPanel";

type Props = {
  // id: string | null;
  // x: number;
  // y: number;
  // label: string;
  node: Node;
  onChangeLabel?: (id: string, label: string) => void;
  action?: boolean;
  isEditable?: boolean;
};

export default function BondNode({
  // id,
  // x,
  // y,
  // label,
  node,
  onChangeLabel,
  action,
  isEditable = true,
}: Props) {
  const { id, x, y, label, selected } = node;
  // const [isEditing, setIsEditing] = useState(false);
  // const [currentLabel, setCurrentLabel] = useState(label);
  // const handleTextClick = () => {
  //   setIsEditing(true);
  // };
  const handleLabelChange = (newLabel: string) => {
    if (onChangeLabel) {
      onChangeLabel(id as string, newLabel);
    }
  };
  return (
    <>
      <Circle
        key={id}
        x={x}
        y={y}
        radius={10}
        draggable={action}
        fill={"white"}
      />
      {
        <>
          {/* <Text
            x={x - 5}
            y={y - 5} // Position the label slightly below the circle
            text={label}
            fontSize={15}
            fill="black"
          /> */}
          <EditableTextInput
            x={x}
            y={y}
            color={selected ? "red" : "black"}
            value={label ?? ""}
            onChange={handleLabelChange}
            isEditable={isEditable}
          />
        </>
      }
    </>
  );
}
