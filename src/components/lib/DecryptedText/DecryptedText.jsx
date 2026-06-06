import { useEffect, useState } from "react";

export default function DecryptedText({
  text,
  speed = 100,
  className = "",
  encryptedClassName = "",
}) {
  const [displayText, setDisplayText] = useState(
    text
      .split("")
      .map(() => "?")
      .join(""),
  );

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return Math.random().toString(36)[2];
          })
          .join(""),
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayText.split("").map((char, index) => (
        <span
          key={index}
          className={char === text[index] ? className : encryptedClassName}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
