import React, { useState } from "react";
import { Group, Circle, Text } from "react-konva";
import { BondType, updateBond } from "./utils/bond";
import EditableTextInput from "./components/EditableTextInput";

type Props = {
  id: string | null;
  x: number;
  y: number;
  label: string;
  onChangeLabel: (id: string, label: string) => void;
};

export default function BondNode({ id, x, y, label, onChangeLabel }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const handleTextClick = () => {
    setIsEditing(true);
  };
  const handleLabelChange = (newLabel: string) => {
    onChangeLabel(id as string, newLabel);
  };
  return (
    <>
      <Circle key={id} x={x} y={y} radius={10} fill="white" />
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
            value={label}
            onChange={handleLabelChange}
          />
        </>
      }
    </>
  );
}
