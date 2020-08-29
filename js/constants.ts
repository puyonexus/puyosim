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

/** @deprecated Use enum types and constants instead. */
export const Constants = {
  Puyo: {
    None: PuyoType.None,
    Red: PuyoType.Red,
    Green: PuyoType.Green,
    Blue: PuyoType.Blue,
    Yellow: PuyoType.Yellow,
    Purple: PuyoType.Purple,

    Nuisance: PuyoType.Nuisance,
    Point: PuyoType.Point,
    Sun: PuyoType.Sun,
    Hard: PuyoType.Hard,
    Iron: PuyoType.Iron,
    Block: PuyoType.Block,

    Delete: PuyoType.Delete,

    Cleared: {
      Red: PuyoType.ClearedRed,
      Green: PuyoType.ClearedGreen,
      Blue: PuyoType.ClearedBlue,
      Yellow: PuyoType.ClearedYellow,
      Purple: PuyoType.ClearedPurple,

      Nuisance: PuyoType.ClearedNuisance,
      Point: PuyoType.ClearedPoint,
      Sun: PuyoType.ClearedSun,
    },
  },

  Field: {
    DefaultWidth: FieldDefaultWidth,
    DefaultHeight: FieldDefaultHeight,
    DefaultHiddenRows: FieldDefaultHiddenRows,
  },

  Simulation: {
    DefaultSpeed: SimulationDefaultSpeed,
    DefaultPuyoToClear: SimulationDefaultPuyoToClear,
    DefaultTargetPoints: SimulationDefaultTargetPoints,
    DefaultPointPuyoBonus: SimulationDefaultPointPuyoBonus,
  },
};
