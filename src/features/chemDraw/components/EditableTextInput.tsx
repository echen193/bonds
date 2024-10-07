import React, { useState } from "react";
import { Html } from "react-konva-utils";
import { Group, Circle, Text } from "react-konva";
type Props = {
  x: number;
  y: number;
  value: string;
  color?: string;
  onChange: (newLabel: string) => void;
  isEditable?: boolean;
};
export default function EditableTextInput({
  x,
  y,
  value,
  color = "black",
  onChange,
  isEditable = true,
}: Props) {
  const [label, setLabel] = useState(value);
  const [isEditing, setisEditing] = useState(false);
  const baseStyle = {
    width: `50px`,
    height: `50px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    colour: "black",
    fontSize: "18px",
    fontFamily: "sans-serif",
  } as any;
  const RETURN_KEY = 13;
  const ESCAPE_KEY = 27;
  const onKeyDown = (e: any) => {
    if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
      setisEditing(false);
    }
    if (e.keyCode === RETURN_KEY && !e.shiftKey) {
      onChange(e.target.value);
    }
    if (e.keyCode === ESCAPE_KEY) {
      setLabel(value);
    }
  };
  return (
    <>
      {!isEditing && (
        <Text
          x={x - 5}
          y={y - 5} // Position the label slightly below the circle
          text={value}
          fontSize={15}
          fill={color}
          onDblClick={() => {
            if (!isEditable) {
              return;
            }
            setisEditing(true);
          }}
        />
      )}
      <Html
        groupProps={{ x: x - 5, y: y - 5 }}
        divProps={{ style: { opacity: 1 } }}
      >
        {isEditing && (
          <textarea
            value={label}
            onChange={(e: any) => setLabel(e.target.value)}
            onKeyDown={onKeyDown}
            style={baseStyle}
          />
        )}
      </Html>
    </>
  );
}
