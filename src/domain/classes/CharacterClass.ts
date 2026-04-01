import type { CharacterClassId } from "@/domain/types";

export interface CharacterClassDefinition {
  id: CharacterClassId;
  name: string;
  lore: string;
  primaryColor: string;
  accentColor: string;
  startMessage: string;
}
