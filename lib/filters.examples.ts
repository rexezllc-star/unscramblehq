import { filterWords } from "./filters";

const sampleWords = [
  "apple",
  "angle",
  "quartz",
  "queen",
  "zebra",
  "table",
  "cable",
  "thing",
  "think",
];

console.log(
  filterWords(sampleWords, {
    length: 5,
    startsWith: "a",
    endsWith: "e",
  })
);

console.log(
  filterWords(sampleWords, {
    contains: "qu",
  })
);

console.log(
  filterWords(sampleWords, {
    exclude: ["z"],
  })
);

console.log(
  filterWords(sampleWords, {
    pattern: "a???e",
  })
);