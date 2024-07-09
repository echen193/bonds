import { Box, Card, CardActions, CardContent } from "@mui/material";
import { DrawingPanel } from "./DrawingPanel";
import { DrawingMenu } from "./DrawingMenu";
import { useState } from "react";
import { BondType } from "./utils/bond";
import { Actions } from "./actions";
import { SelectMenu } from "./SelectMenu";

export function DrawingContainer() {
  const [action, setAction] = useState<Actions>(Actions.SELECT);

  const [bondType, setBondType] = useState<BondType>(BondType.Single);
  return (
    <Box>
      <Card variant="outlined" sx={{ minHeight: 500 }}>
        <CardActions>
          <DrawingMenu action={bondType} setAction={setBondType} />
          <SelectMenu action={action} setAction={setAction} />
        </CardActions>
        <CardContent>
          <DrawingPanel bondType={bondType} />
        </CardContent>
      </Card>
    </Box>
  );
}
