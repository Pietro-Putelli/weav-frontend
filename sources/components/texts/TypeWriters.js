import React, { useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import TypeWriter from "react-native-typewriter";
import MainText from "./MainText";

const TypeWriters = ({ texts }) => {
  const [typing, setTyping] = useState(1);
  const [index, setIndex] = useState(0);

  const onTypingEnd = () => {
    const newTyping = typing == 1 ? -1 : 1;
    const newIndex = (index + 1) % texts.length;

    if (newTyping == 1) {
      setIndex(newIndex);
    }

    setTyping(newTyping);
  };

  return (
    <MainText
      font="title-4"
      bold
      style={{
        fontSize: RFPercentage(3.8),
      }}
    >
      <TypeWriter
        delayMap={[{ at: texts[index].length - 1, delay: 200 }]}
        onTypingEnd={onTypingEnd}
        typing={typing}
      >
        {texts[index]}
      </TypeWriter>
    </MainText>
  );
};

export default TypeWriters;
