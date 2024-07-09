import { Box, Card, CardActions, CardContent } from "@mui/material";
import { DrawingPanel } from "./DrawingPanel";
import { DrawingMenu } from "./DrawingMenu";
import { useState } from "react";
import { Actions } from "./model";

export function DrawingContainer() {
  const [action, setAction] = useState<Actions>(Actions.SELECT);
  const [fillColor, setFillColor] = useState<string>("red");
  return (
    <Box>
      <Card variant="outlined" sx={{ minHeight: 500 }}>
        <CardContent>
          <DrawingPanel action={action} fillColor={fillColor} />
        </CardContent>
        <CardActions>
          <DrawingMenu
            action={action}
            setAction={setAction}
            fillColor={fillColor}
            setFillColor={setFillColor}
          />
        </CardActions>
        <CardContent>
          <DrawingPanel action={action} fillColor={fillColor} />
        </CardContent>
      </Card>
    </Box>
  );
}
