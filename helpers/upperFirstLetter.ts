export const upperFirstLetter = (text: string) => {
  text
    .split(" ")
    .map((text, i) => text.replace(text[0], text[0].toUpperCase()));
};
