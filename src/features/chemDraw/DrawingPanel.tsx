import Konva from "konva";
import { KonvaPointerEvent } from "konva/lib/PointerEvents";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, Circle, Layer, Line, Rect, Stage } from "react-konva";
// import { Bonds, Bond, BondPosition, BondType } from "./model";
import { v4 as uuid } from "uuid";
import { BondType, fixedLengthLine } from "./utils/bond";
import Bond from "./Bond";
import BondNode from "./BondNode";

type Node = {
  x: number;
  y: number;
  id: string | null;
  label?: string;
};

type Edge = {
  from: string | null;
  to: string | null;
  bondType: BondType;
  id: string;
};

type DrawingPanelProps = {
  bondType: BondType;
};

export function DrawingPanel({ bondType }: DrawingPanelProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);
  const currentNodeRef = useRef<Node>();

  const addNode = (pos: { x: number; y: number }) => {
    const nid = `node-${uuid()}`;
    const newNode: Node = { x: pos.x, y: pos.y, id: nid, label: "C" };
    setNodes((prev) => [...prev, newNode]);
    return newNode;
  };
  const getClosestNode = useCallback(
    (pos: { x: number; y: number }, toNodeId?: string | null) => {
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
  const removeNode = (nodeId: string | null) => {
    if (!nodeId) {
      return;
    }
    setNodes((prev) => {
      return prev.filter((n) => n.id !== nodeId);
    });
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

  const handlePanelMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    let fromNode = getClosestNode(pos);
    console.log("====closetNode fromNode==", fromNode);
    if (!fromNode) {
      //fromNode = addNode(pos);
      fromNode = {
        x: pos.x,
        y: pos.y,
        id: null,
      };
    }
    console.log("===fromNode====", fromNode);
    currentNodeRef.current = fromNode;

    // const { id: fromId } = fromNode;
    // const toNode = addNode(pos);

    if (!isDrawing) {
      // const newEdge = { from: fromId, to: toNode.id, bondType };
      // setEdges((prev) => [...prev, newEdge]);
      // setCurrentEdge(newEdge);

      setIsDrawing(true);
    }
  };

  const handlePanelMouseMove = (e: any) => {
    if (!isDrawing || !currentNodeRef.current) {
      return;
    }
    console.log("===currentNodeRef.current====", isDrawing);
    const pos = e.target.getStage().getPointerPosition();
    // calculate  distance between current position and start position of the edge
    // if greater than 100 return
    // const toNodeId = currentEdge.to || "";
    // const fromNodeId = currentEdge.from;
    // const fromNode = nodes.find((n) => n.id === fromNodeId);
    let fromNode = currentNodeRef.current;

    if (!fromNode) {
      return;
    }

    const distance = Math.sqrt(
      (pos.x - fromNode.x) ** 2 + (pos.y - fromNode.y) ** 2
    );
    console.log("===distance====", distance);

    if (distance < 20) {
      return;
    }
    if (!fromNode.id) {
      fromNode = addNode({ x: fromNode.x, y: fromNode.y });
      currentNodeRef.current = fromNode;
      console.log("===addNode====", fromNode);
    }
    if (!currentEdge) {
      const toNode = addNode(pos);
      const newEdge = {
        from: fromNode.id,
        to: toNode.id,
        bondType,
        id: uuid(),
      };
      setEdges((prev) => [...prev, newEdge]);
      setCurrentEdge(newEdge);

      return;
    }
    const toNodeId = currentEdge.to;
    let toNode = nodes.find((n) => n.id === toNodeId);
    if (!toNode) {
      return;
    }
    const closestNode = getClosestNode(pos, toNodeId);
    let toNodePos = pos;
    if (!closestNode) {
      const fixedLengthPos = fixedLengthLine(fromNode, pos, 100);
      toNodePos = fixedLengthPos;
    }

    toNode = {
      ...toNode,
      ...toNodePos,
    };
    // // const endPos = pos;

    setNodes((prev: any) => {
      // const toNode = prev.find((n) => n.id === toNodeId);

      const otherNodes = prev.filter((pn: Node) => pn.id !== toNodeId);
      return [...otherNodes, toNode];
    });
  };

  const handleMouseUp = (e: any) => {
    console.log("-----handleMouseUp--");
    if (isDrawing && currentEdge) {
      const pos = e.target.getStage().getPointerPosition();
      const toNodeId = currentEdge.to;
      let endPos = getClosestNode(pos, toNodeId);
      if (endPos) {
        currentEdge.to = endPos.id;
        removeNode(toNodeId);
      }
    }
    setEdges((prev: Edge[]) => {
      const validEdges = prev.filter((e) => e.from !== e.to);
      return validEdges;
    });

    setIsDrawing(false);
    setCurrentEdge(null);
    currentNodeRef.current = undefined;
  };
  const onBondUpdate = (edgeId: string, newBond: BondType) => {
    //
    const selectedEdge = edges.find((e) => {
      return e.id === edgeId;
    });
    if (selectedEdge) {
      selectedEdge.bondType = newBond;
    }
    console.log(edgeId);
  };
  const onNodeLabelChange = (id: string, label: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            label: label.toUpperCase(),
          };
        }
        return n;
      })
    );
  };
  console.log("---edge----", edges);
  console.log("----nodes---", nodes);
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseUp={handleMouseUp}
      onMouseDown={handlePanelMouseDown}
      onMouseMove={handlePanelMouseMove}
    >
      <Layer>
        {edges.map((edge, index) => {
          const fromNode = nodes.find((node) => node.id === edge.from);
          const toNode = nodes.find((node) => node.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <Bond
              to={toNode}
              from={fromNode}
              id={edge.id}
              bondType={edge.bondType}
              onUpdateBond={onBondUpdate}
            />
          );
        })}
        {nodes.map((node) => (
          <BondNode
            id={node.id}
            x={node.x}
            y={node.y}
            label={node.label ?? "C"}
            onChangeLabel={onNodeLabelChange}
          />
          // <Circle
          //   key={node.id}
          //   x={node.x}
          //   y={node.y}
          //   radius={10}
          //   fill="blue"
          //   // draggable
          //   // onDragEnd={(e) => handleNodeDragEnd(e, node.id)}
          //   // onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
          // />
        ))}
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
}
