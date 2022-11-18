import React, { useState } from "react";

const useEmoji = () => {
  const [text, setText] = useState<string>("");

  const [showEmojis, setShowEmojis] = useState(false);
  const addEmoji = (e: { unified: string }) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((el: string) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    console.log(codesArray);
    console.log(emoji);
    setText(text + emoji);
  };

  const resetEmojiAndText = () => {
    setShowEmojis(false);
    setText("");
  };

  return {
    text,
    showEmojis,
    setShowEmojis,
    setText,
    addEmoji,
    resetEmojiAndText,
  };
};

export default useEmoji;
