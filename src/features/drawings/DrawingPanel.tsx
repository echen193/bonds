import Konva from "konva";
import { KonvaPointerEvent } from "konva/lib/PointerEvents";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, Circle, Layer, Line, Rect, Stage } from "react-konva";
import { Actions } from "./model";
import { v4 as uuid } from "uuid";

const DRAWING_ACTIONS = [
  Actions.CIRCLE,
  Actions.RECTANGLE,
  Actions.SCRIBBLE,
  Actions.ARROW,
];
type DrawingPanelProps = {
  action: Actions;
  fillColor: string;
};

export function DrawingPanel({ action, fillColor }: DrawingPanelProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const isPaitingRef = useRef(false);
  const currentIdRef = useRef("");
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [arrows, setArrows] = useState<any[]>([]);
  const [scribbles, setScribbles] = useState<any[]>([]);
  const isDraggable = action === Actions.SELECT;
  useEffect(() => {
    console.log("---stageRef--", stageRef.current);
    console.log("--action--", action);
    if (!stageRef.current || action !== Actions.DOWNLOAD) {
      return;
    }
    const uri = stageRef.current?.toDataURL();
    console.log("----uri--", uri);
    const link = document.createElement("a") as any;
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [action]);
  const handlePointerDown = (e: KonvaPointerEvent) => {
    console.log("handlePointer down");
    if (!DRAWING_ACTIONS.includes(action)) {
      return;
    }

    const stage: any = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    const id = uuid();
    currentIdRef.current = id;
    isPaitingRef.current = true;
    switch (action) {
      case Actions.RECTANGLE: {
        setRectangles((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
          },
        ]);
        break;
      }
      case Actions.CIRCLE: {
        setCircles((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
          },
        ]);
        break;
      }
      case Actions.ARROW: {
        setArrows((prev) => [
          ...prev,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
          },
        ]);
        break;
      }

      case Actions.SCRIBBLE: {
        setScribbles((prev) => [
          ...prev,
          {
            id,
            points: [x, y],
            fillColor,
          },
        ]);
        break;
      }
    }
  };
  const handlePointerUp = (e: KonvaPointerEvent) => {
    console.log("handlePointer up");
    isPaitingRef.current = false;
    currentIdRef.current = "";
  };
  const handlePointerMove = (e: KonvaPointerEvent) => {
    if (!DRAWING_ACTIONS.includes(action) || !isPaitingRef.current) {
      return;
    }
    console.log("handlePointer move");
    const stage: any = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    switch (action) {
      case Actions.RECTANGLE: {
        const updated = rectangles.map((rect) => {
          if (rect.id === currentIdRef.current) {
            return {
              ...rect,
              width: x - rect.x,
              height: y - rect.y,
            };
          }
          return rect;
        });
        setRectangles(updated);
        break;
      }
      case Actions.CIRCLE: {
        const updated = circles.map((circle) => {
          if (circle.id === currentIdRef.current) {
            return {
              ...circle,
              radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
            };
          }
          return circle;
        });
        setCircles(updated);
        break;
      }
      case Actions.ARROW: {
        const updated = arrows.map((arrow) => {
          if (arrow.id === currentIdRef.current) {
            return {
              ...arrow,
              points: [arrow.points[0], arrow.points[1], x, y],
            };
          }
          return arrow;
        });
        setArrows(updated);
        break;
      }
      case Actions.SCRIBBLE: {
        const updated = scribbles.map((scribble) => {
          if (scribble.id === currentIdRef.current) {
            return {
              ...scribble,
              points: [...scribble.points, x, y],
            };
          }
          return scribble;
        });
        setScribbles(updated);
        break;
      }
    }
  };
  console.log(scribbles);
  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight / 2}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Layer>
        {rectangles.map((rectangle) => {
          return (
            <Rect
              key={rectangle.id}
              x={rectangle.x}
              y={rectangle.y}
              stroke="black"
              strokeWidth={2}
              fill={rectangle.fillColor}
              width={rectangle.width}
              height={rectangle.height}
              draggable={isDraggable}
            />
          );
        })}
        {circles.map((circle) => {
          return (
            <Circle
              key={circle.id}
              radius={circle.radius}
              x={circle.x}
              y={circle.y}
              stroke="black"
              strokeWidth={2}
              fill={circle.fillColor}
              draggable={isDraggable}
            />
          );
        })}
        {arrows.map((arrow) => {
          return (
            <Arrow
              key={arrow.id}
              points={arrow.points}
              stroke={arrow.fillColor}
              strokeWidth={2}
              draggable={isDraggable}
            />
          );
        })}
        {scribbles.map((scribble) => {
          return (
            <Line
              key={scribble.id}
              lineCap="round"
              lineJoin="round"
              points={scribble.points}
              stroke={scribble.fillColor}
              strokeWidth={2}
              draggable={isDraggable}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
