export function highlightText(text: string, highlight: string) {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {" "}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.replace(/\s/g, "").toLowerCase() === highlight.toLowerCase()
              ? {
                  backgroundColor: "#ffdf43",
                  color: "#020817",
                }
              : {}
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
}
