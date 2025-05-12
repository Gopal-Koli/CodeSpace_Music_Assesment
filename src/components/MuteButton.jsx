import React from "react";
import { IconButton } from "@mui/material";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";

const MuteButton = ({ isMuted, onToggleMute }) => {
  return (
    <IconButton className="!text-white  !rounded-full" onClick={onToggleMute}>
      {isMuted ? <VolumeOff /> : <VolumeUp />}
    </IconButton>
  );
};

export default MuteButton;