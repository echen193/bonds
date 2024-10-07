import Konva from "konva";
import { KonvaPointerEvent } from "konva/lib/PointerEvents";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, Circle, Layer, Line, Rect, Stage } from "react-konva";
import {
  retrieveNodeEdgeData,
  retrieveNodeEdgeDataUvi,
} from "./services/server";
// import { Bonds, Bond, BondPosition, BondType } from "./model";
import { v4 as uuid } from "uuid";
import {
  BondLength,
  BondType,
  fixedLengthLine,
  isInsideRect,
} from "./utils/bond";
import Bond from "./Bond";
import BondNode from "./BondNode";
import { Actions } from "./actions";
import { DisplayPanel } from "./DisplayPanel";
import axios from "axios";
export type Node = {
  x: number;
  y: number;
  id: string | null;
  label?: string;
  selected?: boolean;
};

export type Edge = {
  from: string | null;
  to: string | null;
  bondType: BondType;
  id: string;
  selected?: boolean;
};

type DrawingPanelProps = {
  action: Actions;
  bondType: BondType;
  showNodes: boolean;
};

export function DrawingPanel({
  bondType,
  action,
  showNodes,
}: DrawingPanelProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rdNodes, setRdNodes] = useState<Node[]>([]);
  const [rdEdges, setRdEdges] = useState<Edge[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [displaySmiles, setDisplaySmiles] = useState("");
  const [selectedSmiles, setSelectedSmiles] = useState("");
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [selectRect, setSelectRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });
  useEffect(() => {
    if (action === Actions.CLEAR) {
      handleClear();
    }
  }, [action]);

  useEffect(() => {
    drawRDNodes(nodes, edges);
    // retrieveSmiles(selectedNodes, selectedEdges);
  }, [edges]);
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
      return closestNode;
    },
    [nodes]
  );
  const removeNode = (nodeId: string | null) => {
    if (!nodeId) {
      return nodes;
    }
    const updatedNodes = nodes.filter((n) => n.id !== nodeId);
    setNodes(updatedNodes);
    return updatedNodes;
  };

  // const handleNodeDragEnd = (e: any, id: string) => {
  //   const newNodes = nodes.map((node) => {
  //     if (node.id === id) {
  //       return {
  //         ...node,
  //         x: e.target.x(),
  //         y: e.target.y(),
  //       };
  //     }
  //     return node;
  //   });
  //   setNodes(newNodes);
  // };
  const drawRDNodes = async (nodes: any[], edges: any[]) => {
    try {
      const response = await retrieveNodeEdgeDataUvi(nodes, edges);
      const coordinates = response.data.coordinates;
      const bonds = response.data.bonds;
      const smiles = response.data.smiles;
      // Use coordinates and bonds to draw new nodes using RDKit
      setRdNodes(coordinates);
      setRdEdges(bonds);
      setDisplaySmiles(smiles);
    } catch (error) {
      console.error("Error sending node/edge data:", error);
    }
  };
  const retrieveSmiles = async (nodes: any[], edges: any[]) => {
    // Only retrieves smiles field from Flask.
    try {
      const response = await retrieveNodeEdgeDataUvi(nodes, edges);
      const smiles = response.data.smiles;
      setSelectedSmiles(smiles);
    } catch (error) {
      console.error("Error sending node/edge data:", error);
    }
  };

  const initDrawing = (pos: any) => {
    let fromNode = getClosestNode(pos);
    if (!fromNode) {
      fromNode = {
        x: pos.x,
        y: pos.y,
        id: null,
      };
    }
    return fromNode;
  };
  console.log("---selectedSmiles--", selectedSmiles);
  const handlePanelMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();

    if (action === Actions.SELECT || action === Actions.DELETE) {
      setIsSelected(true);
      currentNodeRef.current = pos;
      return;
    }

    const fromNode = initDrawing(pos);

    currentNodeRef.current = fromNode;

    if (!isDrawing) {
      setIsDrawing(true);
    }
  };
  const handleDrawing = (fromNode: any, pos: any) => {
    if (!fromNode.id) {
      fromNode = addNode({ x: fromNode.x, y: fromNode.y });
      currentNodeRef.current = fromNode;
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
      const fixedLengthPos = fixedLengthLine(fromNode, pos, BondLength);
      toNodePos = fixedLengthPos;
    }

    toNode = {
      ...toNode,
      ...toNodePos,
    };

    setNodes((prev: any) => {
      const otherNodes = prev.filter((pn: Node) => pn.id !== toNodeId);
      return [...otherNodes, toNode];
    });
  };

  const updateSelection = (pos: any) => {
    const from = currentNodeRef.current;
    if (!from) {
      return;
    }
    const width = pos.x - from.x;
    const height = pos.y - from.y;
    setSelectRect({ x: from.x, y: from.y, width, height });
  };
  const handlePanelMouseMove = (e: any) => {
    if (!currentNodeRef.current) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    if (isSelected) {
      return updateSelection(pos);
    }
    if (!isDrawing) {
      return;
    }
    let fromNode = currentNodeRef.current;

    if (!fromNode) {
      return;
    }

    const distance = Math.sqrt(
      (pos.x - fromNode.x) ** 2 + (pos.y - fromNode.y) ** 2
    );

    if (distance < 20) {
      return;
    }
    handleDrawing(fromNode, pos);
  };
  const updateSelected = (currentNodes: Node[]) => {
    const updatedNodes = currentNodes.map((node) => {
      const pos = { x: node.x, y: node.y };
      const selected = isInsideRect(pos, selectRect);

      return { ...node, selected };
    });
    setNodes(updatedNodes);
    const updatedEdges = edges.map((edge) => {
      const fromNode = updatedNodes.find((n) => n.id === edge.from);
      const toNode = updatedNodes.find((n) => n.id === edge.to);

      return { ...edge, selected: fromNode?.selected && toNode?.selected };
    });
    const selectedNodes = updatedNodes.filter((n) => n.selected);
    const selectedEdges = updatedEdges.filter((e) => e.selected);
    retrieveSmiles(selectedNodes, selectedEdges);
    setEdges(updatedEdges);
  };
  console.log("-----smiles--", displaySmiles);
  // useEffect(() => {
  //   const updatedEdges = edges.map((edge) => {
  //     const fromNode = nodes.find((n) => n.id === edge.from);
  //     const toNode = nodes.find((n) => n.id === edge.to);

  //     return { ...edge, selected: fromNode?.selected && toNode?.selected };
  //   });
  //   setEdges(updatedEdges);
  // }, [edges, nodes]);
  const handleMouseUp = (e: any) => {
    // Drawing reset
    let currentNodes = nodes;
    if (isDrawing && currentEdge) {
      const pos = e.target.getStage().getPointerPosition();
      const toNodeId = currentEdge.to;
      const endPos = getClosestNode(pos, toNodeId);

      if (endPos) {
        currentEdge.to = endPos.id;
        currentNodes = removeNode(toNodeId);
      }
    }
    setEdges((prev: Edge[]) => {
      const validEdges = prev.filter((e) => e.from !== e.to);
      return validEdges;
    });

    // Reset selection
    setIsDrawing(false);
    setCurrentEdge(null);
    updateSelected(currentNodes);
    if (action === Actions.DELETE) {
      deleteSelected(currentNodes);
    }

    setIsSelected(false);
    setSelectRect({ x: 0, y: 0, width: 0, height: 0 });

    currentNodeRef.current = undefined;
  };
  const onBondUpdate = (edgeId: string, newBond: BondType) => {
    const updatedEdges = edges.map((edge) => {
      if (edge.id === edgeId) {
        const changeDirection =
          newBond === BondType.Front || newBond === BondType.Back;
        return {
          ...edge,
          bondType: newBond,
          from: changeDirection ? edge.to : edge.from,
          to: changeDirection ? edge.from : edge.to,
        };
      }
      return edge;
    });

    setEdges(updatedEdges);
  };
  const handleClear = () => {
    setNodes([]);
    setEdges([]);
  };
  const deleteSelected = (currentNodes: Node[]) => {
    const updatedNodes = currentNodes.filter((node) => {
      const pos = { x: node.x, y: node.y };
      return !isInsideRect(pos, selectRect);
    });
    setNodes(updatedNodes);
    const updatedEdges = edges.filter((edge) => {
      const fromNode = updatedNodes.find((n) => n.id === edge.from);
      const toNode = updatedNodes.find((n) => n.id === edge.to);
      return fromNode && toNode;
    });
    setEdges(updatedEdges);
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

  return (
    <div className="flex">
      <Stage
        width={window.innerWidth / 2}
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
                selected={edge.selected}
                onUpdateBond={onBondUpdate}
              />
            );
          })}
          {showNodes &&
            nodes.map((node) => (
              <BondNode
                node={node}
                onChangeLabel={onNodeLabelChange}
                //action={}
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
          {isSelected && <Rect {...selectRect} stroke="red" />}
        </Layer>
      </Stage>
      <div className="flex flex-column border-l-8">
        {/* <DisplayPanel nodes={nodes} edges={edges} showNodes={showNodes} /> */}
        <div>
          {" "}
          <p>SMILES:</p>
          {displaySmiles}
        </div>
        <DisplayPanel nodes={rdNodes} edges={rdEdges} showNodes={showNodes} />
      </div>
    </div>
  );
}
