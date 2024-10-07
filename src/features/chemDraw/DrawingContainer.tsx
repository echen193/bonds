import {
  Box,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { DrawingPanel } from "./DrawingPanel";
import { DrawingMenu } from "./DrawingMenu";
import { useState } from "react";
import { BondType } from "./utils/bond";
import { Actions } from "./actions";
import { SelectMenu } from "./SelectMenu";
import { DisplayPanel } from "./DisplayPanel";

export function DrawingContainer() {
  const [action, setAction] = useState<Actions>(Actions.SELECT);

  const [bondType, setBondType] = useState<BondType>(BondType.Single);
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ minHeight: 500 }}>
        <CardActions>
          <DrawingMenu action={bondType} setAction={setBondType} />
          <SelectMenu action={action} setAction={setAction} />
          <FormGroup>
            <FormControlLabel
              control={<Switch />}
              label={checked ? "Hide Nodes" : "Show Nodes"}
              checked={checked}
              onChange={(e: any) => {
                handleChange(e);
              }}
            />
          </FormGroup>
        </CardActions>
        <CardContent>
          <DrawingPanel
            bondType={bondType}
            action={action}
            showNodes={checked}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
