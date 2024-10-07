import React, { useEffect, useState } from "react";
import { Stage, Layer, Text } from "react-konva";
import { Node, Edge } from "./DrawingPanel";
import Bond from "./Bond";
import BondNode from "./BondNode";
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
  console.log("----centerX: ", centerX);
  console.log("----centerY: ", centerY);
  console.log("Edges: ", edges);
  return (
    <Stage width={window.innerWidth / 2} height={window.innerHeight}>
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
      </Layer>
    </Stage>
  );
}