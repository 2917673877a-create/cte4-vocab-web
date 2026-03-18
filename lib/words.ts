import wordsData from "@/data/words.json";
import { Word } from "@/lib/types";

export const words: Word[] = wordsData as Word[];

export function getWordById(id: string) {
  return words.find((word) => word.id === id);
}
