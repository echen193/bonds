import React, { useEffect, useState } from "react";
import { Stage, Layer, Text } from "react-konva";
import { Node, Edge } from "./DrawingPanel";
import Bond from "./Bond";
import BondNode from "./BondNode";
import { Rect } from "react-konva";
type NodeList = Node[];
type EdgeList = Edge[];
type Props = {
  nodes: NodeList;
  edges: EdgeList;
  showNodes: boolean;
};

export function DisplayPanel({ nodes, edges, showNodes }: Props) {
  const centerX = window.innerWidth / 4;
  const centerY = window.innerHeight / 4;
  const transformedNodes = nodes.map((n) => ({
    ...n,
    x: n.x + centerX,
    y: n.y + centerY,
  }));
  const [selectRect, setSelectRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  console.log("Selected Nodes:", selectedNodes);
  return (
    <Stage
      width={window.innerWidth / 2}
      height={window.innerHeight}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
    >
      <Layer>
        {edges.map((edge, index) => {
          const fromNode = transformedNodes.find(
            (node) => node.id === edge.from
          );

          const toNode = transformedNodes.find((node) => node.id === edge.to);

          if (!fromNode || !toNode) return null;
          // console.log("Edge: ", edge);
          // console.log("From: ", fromNode);
          // console.log("To: ", toNode);
          return (
            <Bond
              to={toNode}
              from={fromNode}
              id={edge.id}
              bondType={edge.bondType}
              selected={edge.selected}
            />
          );
        })}
        {showNodes &&
          transformedNodes.map((node) => {
            return <BondNode node={node} isEditable={false} />;
          })}
        {isSelecting && (
          <Rect
            x={selectRect.x}
            y={selectRect.y}
            width={selectRect.width}
            height={selectRect.height}
            stroke="blue"
          />
        )}
      </Layer>
    </Stage>
  );
}
