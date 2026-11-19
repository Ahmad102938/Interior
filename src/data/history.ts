import type { Status } from "@/lib/content";

export type Milestone = {
  id: string;
  period: string;
  title: string;
  description: string;
  status: Status;
};

/**
 * Company timeline. Every entry is a structural placeholder until management
 * supplies the approved history — the inception year in particular is disputed
 * (2014 in the draft vs 2017 on the existing About page).
 */
export const history: Milestone[] = [
  {
    id: "inception",
    period: "[Year]",
    title: "Company established",
    description: "Inception and founding focus — awaiting the approved establishment date and history.",
    status: "pending",
  },
  {
    id: "telecom",
    period: "[Year]",
    title: "Telecom infrastructure execution",
    description: "Site development, tower-related works and allied power systems.",
    status: "pending",
  },
  {
    id: "solar",
    period: "[Year]",
    title: "Entry into solar & renewable energy",
    description: "Foundations, mounting structures and module installation support.",
    status: "pending",
  },
  {
    id: "civil",
    period: "[Year]",
    title: "Civil & industrial construction",
    description: "Industrial sheds, warehouses, RCC structures and external development.",
    status: "pending",
  },
  {
    id: "interiors",
    period: "[Year]",
    title: "Commercial interior & fit-out",
    description: "Turnkey workplace, retail and showroom fit-out execution.",
    status: "pending",
  },
];
