import React, { memo, useState } from "react";
import { icons } from "../../styles";
import IconButton from "./IconButton";

const AudioButton = ({ isMuted, style, onPress }) => {
  const [_isMuted, setIsMuted] = useState(isMuted);

  const iconSource = _isMuted ? "AudioOn" : "AudioOff";

  return (
    <IconButton
      onPress={() => {
        onPress?.();

        setIsMuted(!_isMuted);
      }}
      side="four"
      style={style}
      source={icons[iconSource]}
      blur
    />
  );
};

export default memo(AudioButton);
