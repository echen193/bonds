// src/Graph.tsx
import React, { useCallback, useRef, useState } from "react";
import { Stage, Layer, Circle, Line } from "react-konva";
import { v4 as uuid } from "uuid";
import Bond from "./Bond";
import { fixedLengthLine } from "./utils/bond";
type Node = {
  x: number;
  y: number;
  id: string;
};

type Edge = {
  from: string | null;
  to: string | null;
};

const Graph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // const [currentEdge, setCurrentEdge] = useState<{ from: string; to: { x: number; y: number } | null } | null>(null);
  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);
  const currentNodeRef = useRef<Node>();
  const handleStageClick = (e: any) => {
    // const pos = e.target.getStage().getPointerPosition();
    // const newNode: Node = { x: pos.x, y: pos.y, id: `node-${nodes.length}` };
    // setNodes([...nodes, newNode]);
  };
  const addNode = (pos: { x: number; y: number }) => {
    const nid = `node-${uuid()}`;
    const newNode: Node = { x: pos.x, y: pos.y, id: nid };
    setNodes((prev) => [...prev, newNode]);
    return newNode;
  };

  const handleNodeDragEnd = (e: any, id: string) => {
    const newNodes = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return node;
    });
    setNodes(newNodes);
  };

  const handleNodeMouseDown = (id: string) => {
    if (!isDrawing) {
      setCurrentEdge({ from: id, to: null });
      setIsDrawing(true);
    }
  };

  const handlePanelMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    let fromNode = getClosestNode(pos);
    console.log("====closetNode fromNode==", fromNode);
    if (!fromNode) {
      fromNode = addNode(pos);
    }
    const { id: fromId } = fromNode;
    const toNode = addNode(pos);

    if (!isDrawing) {
      const newEdge = { from: fromId, to: toNode.id };
      setEdges((prev) => [...prev, newEdge]);
      setCurrentEdge(newEdge);

      setIsDrawing(true);
    }
  };

  const handlePanelMouseMove = (e: any) => {
    if (!isDrawing || !currentEdge) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    // calculate  distance between current position and start position of the edge
    // if greater than 100 return
    const toNodeId = currentEdge.to || "";
    const fromNodeId = currentEdge.from;
    const fromNode = nodes.find((n) => n.id === fromNodeId);
    if (!fromNode) {
      return;
    }
    // const endPos = fixedLengthLine(fromNode, pos, 100);
    let closetNode = getClosestNode(pos, toNodeId);
    console.log("====closetNode move==", closetNode);
    const distance = Math.sqrt(
      (pos.x - fromNode.x) ** 2 + (pos.y - fromNode.y) ** 2
    );
    if (closetNode?.id) {
      currentEdge.to = closetNode.id;
      return;
    }
    // console.log(distance);
    if (distance > 100 && !closetNode) {
      return;
    }

    let toNode = nodes.find((n) => n.id === toNodeId);
    if (!toNode) {
      return;
    }
    console.log("---update to node pos---");

    toNode = {
      ...toNode,
      ...pos,
    };
    // const endPos = pos;

    setNodes((prev: any) => {
      // const toNode = prev.find((n) => n.id === toNodeId);

      const otherNodes = prev.filter((pn) => pn.id !== toNodeId);
      return [...otherNodes, toNode];
    });
  };

  const handleMouseUp = (e: any) => {
    if (isDrawing && currentEdge) {
      // const pos = e.target.getStage().getPointerPosition();
      // let endPos = getClosestNode(pos);
      // if (endPos) {
      //   const toNodeId = currentEdge.to;
      //   currentEdge.to = endPos.id;
      //   setNodes((prev) => {
      //     return prev.filter((n) => n.id !== toNodeId);
      //   });
      // }

      setIsDrawing(false);
      setCurrentEdge(null);
      currentNodeRef.current = undefined;
    }
  };

  const getClosestNode = useCallback(
    (pos: { x: number; y: number }, toNodeId: string) => {
      // let closestNode: Node | null = null;
      // let minDistance = Infinity;

      // nodes.forEach((node) => {
      //   const distance = Math.sqrt(
      //     (node.x - pos.x) ** 2 + (node.y - pos.y) ** 2
      //   );
      //   if (distance < minDistance) {
      //     closestNode = node;
      //     minDistance = distance;
      //   }
      // });
      const closestNode = nodes
        .filter((n) => n.id !== toNodeId)
        .find((node) => {
          const distance = Math.sqrt(
            (node.x - pos.x) ** 2 + (node.y - pos.y) ** 2
          );
          return distance < 20;
        });
      console.log("++++++closetNode+++", closestNode);
      return closestNode;
    },
    [nodes]
  );
  console.log("---edge----", edges);
  console.log("----nodes---", nodes);
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={handleStageClick}
      onMouseUp={handleMouseUp}
      onMouseDown={handlePanelMouseDown}
      onMouseMove={handlePanelMouseMove}
    >
      <Layer>
        {nodes.map((node) => (
          <Circle
            key={node.id}
            x={node.x}
            y={node.y}
            radius={10}
            fill="blue"
            // draggable
            // onDragEnd={(e) => handleNodeDragEnd(e, node.id)}
            // onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
          />
        ))}
        {edges.map((edge, index) => {
          const fromNode = nodes.find((node) => node.id === edge.from);
          const toNode = nodes.find((node) => node.id === edge.to);
          if (!fromNode || !toNode) return null;

          return <Bond to={toNode} from={fromNode} id={`e-${index}`} />;
        })}
        {/* {isDrawing && currentEdge && currentEdge.to && (
          <Line
            points={[
              nodes.find(node => node.id === currentEdge.from)!.x,
              nodes.find(node => node.id === currentEdge.from)!.y,
              currentEdge.to.x,
              currentEdge.to.y,
            ]}
            stroke="red"
            dash={[10, 5]}
          />
        )} */}
      </Layer>
    </Stage>
  );
};

export default Graph;
