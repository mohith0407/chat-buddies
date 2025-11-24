const toTitleCase = (str: string) => {
  const words = str.split(" ");

  return words
    .map((word) =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : ""
    )
    .join(" ");
};
export {toTitleCase}