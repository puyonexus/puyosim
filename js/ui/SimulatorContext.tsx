import { createContext } from "preact";
import { PuyoSim } from "../PuyoSim";

export const Sim = createContext<PuyoSim | null>(null);
