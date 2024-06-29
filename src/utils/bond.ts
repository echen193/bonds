
export type Point = {
    x:number
    y:number
}
const LineOffset = 4;
const BondLength = 100;
export enum BondType {
    Single = 1,
    Double,
    Triple
}
export type BondPosition = {
    from: Point,
    to: Point
}

export const updateBond = (start: Point, end: Point, bondType: BondType) => {
  const {x:startX, y:startY} = start;
  const {x:endX, y:endY} = end;
  const dx = endX - startX;
  const dy = endY - startY;
  const slope = dy / dx;

  const perpendicularSlope = -1 / slope;
  const offsetVal =
    LineOffset * Math.sqrt(1 / (1 + Math.pow(perpendicularSlope, 2)));
  // const {from:newStart, to:newEnd} = fixedLengthLine(start, end, BondLength);
  let bonds: BondPosition[] = []
   
  if (bondType === BondType.Single || bondType === BondType.Triple) {
     bonds = [...bonds,  {
        from: start,
        to: end,
      },
    ];
  }

  if (bondType === BondType.Double || bondType === BondType.Triple) {
    const bond1: BondPosition = {
      from:{
        x: start.x - offsetVal,
       y:  start.y - perpendicularSlope * offsetVal,
      },
      to: {x: end.x - offsetVal, y: end.y - perpendicularSlope * offsetVal},
    };
        const bond2: BondPosition = {
      from: {
        x:start.x + offsetVal,
        y:start.y + perpendicularSlope * offsetVal,
      },
      to: {x: end.x + offsetVal, y: end.y + perpendicularSlope * offsetVal},
    };
    bonds = [...bonds, bond1, bond2];
  }

  return bonds;
};

export function fixedLengthLine(
  start: Point,
  end: Point,
  length: number
) {
  const {x:x1, y:y1} = start;
  const {x:x2, x:y2} = end;

  // Calculate the direction vector
  const directionVector: Point = {x:x2 - x1, y:y2 - y1};

  // Calculate the magnitude of the direction vector
  const magnitude: number = Math.sqrt(
    directionVector.x ** 2 + directionVector.y ** 2
  );

  // Ensure the magnitude is not zero to avoid division by zero
  if (magnitude === 0) {
    throw new Error("Start and end points cannot be the same.");
  }

  // Normalize the direction vector to get the unit vector
  const unitVector: Point = {
    x: directionVector.x / magnitude,
    y: directionVector.y / magnitude,
  };

  // Scale the unit vector by the desired length
  const scaledVector: Point = {x:unitVector.x * length,y: unitVector.y * length};

  // Calculate the new end point
  const newEnd: Point = {x: x1 + scaledVector.x, y: y1 + scaledVector.y};

  return newEnd;
}
