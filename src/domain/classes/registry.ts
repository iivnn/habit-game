import type { CharacterClassDefinition } from "@/domain/classes/CharacterClass";
import type { CharacterClassId } from "@/domain/types";

const classRegistry: Record<CharacterClassId, CharacterClassDefinition> = {
  warrior: {
    id: "warrior",
    name: "Guerreiro",
    lore: "Um defensor de vontade firme que transforma disciplina em poder.",
    primaryColor: "#8f5f42",
    accentColor: "#f4cc73",
    startMessage: "Cada tarefa concluida fortalece a sua armadura e honra."
  },
  archer: {
    id: "archer",
    name: "Arqueiro",
    lore: "Um caçador preciso que vence pela constancia, foco e paciencia.",
    primaryColor: "#46613d",
    accentColor: "#b9dc74",
    startMessage: "Cada habito concluido firma sua mira e amplia seu alcance."
  },
  mage: {
    id: "mage",
    name: "Mago",
    lore: "Um estudioso arcano que converte rotina em energia mistica.",
    primaryColor: "#4b54a8",
    accentColor: "#7ad7f0",
    startMessage: "Os seus habitos alimentam runas antigas e novos feitiços."
  },
  rogue: {
    id: "rogue",
    name: "Ladino",
    lore: "Um mestre da agilidade e da estrategia, sempre um passo a frente.",
    primaryColor: "#4e4d58",
    accentColor: "#d3a35d",
    startMessage: "Toda rotina vencida alimenta sua astucia nas sombras."
  },
  cleric: {
    id: "cleric",
    name: "Clerigo",
    lore: "Um guardiao da luz que transforma disciplina em bençãos e cura.",
    primaryColor: "#d9d5c3",
    accentColor: "#f0cf6e",
    startMessage: "Cada tarefa cumprida fortalece sua fe e protege o reino."
  },
  sorcerer: {
    id: "sorcerer",
    name: "Feiticeiro",
    lore: "Um condutor de poder bruto que desperta magia de dentro para fora.",
    primaryColor: "#6a3ea1",
    accentColor: "#f17fd8",
    startMessage: "Suas conquistas diarias despertam correntes antigas de poder."
  },
  knight: {
    id: "knight",
    name: "Cavaleiro",
    lore: "Um nobre combatente de juramento firme, escudo erguido contra o caos.",
    primaryColor: "#6b7b8c",
    accentColor: "#f1dd9a",
    startMessage: "Cada objetivo concluido reforça seu juramento e sua bravura."
  }
};

export const getCharacterClass = (classId: CharacterClassId) => classRegistry[classId];

export const getCharacterClasses = () => Object.values(classRegistry);
