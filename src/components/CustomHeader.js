import React from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

const CustomHeader = ({ slotDuration, setSlotDuration }) => {
  return (
    <div className="fc-header-toolbar">
      <div className="fc-toolbar-left">
        <h2>My Calendar</h2>
      </div>
      <div className="fc-toolbar-right">
        <FormControl>
          <FormLabel id="slot-duration-select">Slot Duration</FormLabel>
          <RadioGroup
            aria-labelledby="slot-duration-select-options"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            name="slot-duration-select-options"
            sx={{ display: "block" }}
          >
            <FormControlLabel
              value="00:15:00"
              control={<Radio size="small" />}
              label="15min"
            />
            <FormControlLabel
              value="00:30:00"
              control={<Radio size="small" />}
              label="30min"
            />
            <FormControlLabel
              value="01:00:00"
              control={<Radio size="small" />}
              label="1h"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default CustomHeader;
