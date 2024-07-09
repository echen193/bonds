import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Bonds } from "./model";
import { GiArrowCursor } from "react-icons/gi";
import { BsPencil } from "react-icons/bs";
import {
  FaRegCircle,
  FaLongArrowAltRight,
  FaDownload,
  FaUndoAlt,
} from "react-icons/fa";
import { RiRectangleLine } from "react-icons/ri";
import { TfiMinus } from "react-icons/tfi";
import { TfiLineDouble } from "react-icons/tfi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { TfiMenu } from "react-icons/tfi";
import { BondType } from "./utils/bond";
import { Actions } from "./actions";
type Props = {
  action: Actions;
  setAction: (action: Actions) => void;
};
export function SelectMenu({ action, setAction }: Props) {
  return (
    <ToggleButtonGroup value={action} exclusive>
      <ToggleButton
        value={Actions.SELECT}
        className={
          action === Actions.SELECT ? "bg-violet-300" : " hover:bg-violet-100"
        }
        onClick={() => setAction(Actions.SELECT)}
      >
        <GiArrowCursor size="2rem" />
      </ToggleButton>
      <Button
        variant="outlined"
        value={Actions.CLEAR}
        className=" hover:bg-violet-100"
        onClick={() => setAction(Actions.CLEAR)}
      >
        <FaUndoAlt size="2rem" />
      </Button>
    </ToggleButtonGroup>
  );
}
