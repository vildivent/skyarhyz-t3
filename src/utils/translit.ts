export default function translit(word: string) {
  const converter = getConverter();

  let answer = "";

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const obj = converter.find((item) => item.charRu === char);

    if (obj) answer += obj.translition;
    else answer += char;
  }
  answer = answer.replace(/( )/g, "_");

  return answer;
}

const getConverter = () => [
  { charRu: "а", translition: "a" },
  { charRu: "б", translition: "b" },
  { charRu: "в", translition: "v" },
  { charRu: "г", translition: "g" },
  { charRu: "д", translition: "d" },
  { charRu: "е", translition: "e" },
  { charRu: "ё", translition: "e" },
  { charRu: "ж", translition: "zh" },
  { charRu: "з", translition: "z" },
  { charRu: "и", translition: "i" },
  { charRu: "й", translition: "y" },
  { charRu: "к", translition: "k" },
  { charRu: "л", translition: "l" },
  { charRu: "м", translition: "m" },
  { charRu: "н", translition: "n" },
  { charRu: "о", translition: "o" },
  { charRu: "п", translition: "p" },
  { charRu: "р", translition: "r" },
  { charRu: "с", translition: "s" },
  { charRu: "т", translition: "t" },
  { charRu: "у", translition: "u" },
  { charRu: "ф", translition: "f" },
  { charRu: "х", translition: "h" },
  { charRu: "ц", translition: "c" },
  { charRu: "ч", translition: "ch" },
  { charRu: "ш", translition: "sh" },
  { charRu: "щ", translition: "sch" },
  { charRu: "ъ", translition: "" },
  { charRu: "ы", translition: "y" },
  { charRu: "ь", translition: "" },
  { charRu: "э", translition: "e" },
  { charRu: "ю", translition: "yu" },
  { charRu: "я", translition: "ya" },

  { charRu: "А", translition: "A" },
  { charRu: "Б", translition: "B" },
  { charRu: "В", translition: "V" },
  { charRu: "Г", translition: "G" },
  { charRu: "Д", translition: "D" },
  { charRu: "Е", translition: "E" },
  { charRu: "Ё", translition: "E" },
  { charRu: "Ж", translition: "Zh" },
  { charRu: "З", translition: "Z" },
  { charRu: "И", translition: "I" },
  { charRu: "Й", translition: "Y" },
  { charRu: "К", translition: "K" },
  { charRu: "Л", translition: "L" },
  { charRu: "М", translition: "M" },
  { charRu: "Н", translition: "N" },
  { charRu: "О", translition: "O" },
  { charRu: "П", translition: "P" },
  { charRu: "Р", translition: "R" },
  { charRu: "С", translition: "S" },
  { charRu: "Т", translition: "T" },
  { charRu: "У", translition: "U" },
  { charRu: "Ф", translition: "F" },
  { charRu: "Х", translition: "H" },
  { charRu: "Ц", translition: "C" },
  { charRu: "Ч", translition: "Ch" },
  { charRu: "Ш", translition: "Sh" },
  { charRu: "Щ", translition: "Sch" },
  { charRu: "Ъ", translition: "" },
  { charRu: "Ы", translition: "Y" },
  { charRu: "Ь", translition: "" },
  { charRu: "Э", translition: "E" },
  { charRu: "Ю", translition: "Yu" },
  { charRu: "Я", translition: "Ya" },
];
