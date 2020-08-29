/*
 * Constants
 *
 * Contains constants used for the simulator.
 */

export enum PuyoType {
  None = 0,
  Red = 1,
  Green = 2,
  Blue = 3,
  Yellow = 4,
  Purple = 5,

  Nuisance = 6,
  Point = 7,
  Sun = 8,
  Hard = 9,
  Iron = 10,
  Block = 11,

  Delete = 12,

  ClearedRed = 13,
  ClearedGreen = 14,
  ClearedBlue = 15,
  ClearedYellow = 16,
  ClearedPurple = 17,

  ClearedNuisance = 18,
  ClearedPoint = 19,
  ClearedSun = 20,
}

export const FieldDefaultWidth = 6;
export const FieldDefaultHeight = 12;
export const FieldDefaultHiddenRows = 1;

export const SimulationDefaultSpeed = 500;
export const SimulationDefaultPuyoToClear = 4;
export const SimulationDefaultTargetPoints = 70;
export const SimulationDefaultPointPuyoBonus = 50;
