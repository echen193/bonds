import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { GiArrowCursor } from "react-icons/gi";
import { BsPencil } from "react-icons/bs";
import { FaRegCircle, FaLongArrowAltRight, FaDownload } from "react-icons/fa";
import { RiRectangleLine } from "react-icons/ri";
import { TfiMinus } from "react-icons/tfi";
import { TfiLineDouble } from "react-icons/tfi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { TfiMenu } from "react-icons/tfi";
import { BondType } from "./utils/bond";
import { Actions } from "./actions";
import { BsTriangleFill } from "react-icons/bs";
import { TbTriangleInverted } from "react-icons/tb";
import { BsTriangle } from "react-icons/bs";
type DrawingMenuProps = {
  action: BondType;
  setAction: (action: BondType) => void;
};
export function DrawingMenu({ action, setAction }: DrawingMenuProps) {
  return (
    <ToggleButtonGroup value={action} exclusive>
      {/* <ToggleButton
        value={Actions.SELECT}
        className={
          action === Actions.SELECT ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(Actions.SELECT)}
      >
      <GiArrowCursor size="2rem" />
      </ToggleButton> */}
      <ToggleButton
        value={BondType.Single}
        className={
          action === BondType.Single ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(BondType.Single)}
      >
        <TfiLayoutLineSolid size="2rem" />
      </ToggleButton>

      <ToggleButton
        value={BondType.Double}
        className={
          action === BondType.Double ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(BondType.Double)}
      >
        <TfiLineDouble size="2rem" />
      </ToggleButton>
      <ToggleButton
        value={BondType.Triple}
        className={
          action === BondType.Triple ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(BondType.Triple)}
      >
        <TfiMenu size="2rem" />
      </ToggleButton>
      <ToggleButton
        value={BondType.Front}
        className={
          action === BondType.Front ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(BondType.Front)}
      >
        <BsTriangleFill size="2rem" />
      </ToggleButton>
      <ToggleButton
        value={BondType.Back}
        className={
          action === BondType.Back ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(BondType.Back)}
      >
        <BsTriangle size="2rem" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
