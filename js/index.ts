/*!
 * PuyoSim 4.3.0
 * https://github.com/puyonexus/puyosim/
 */

import "./common";
import $ from "jquery";
import { PuyoSim } from "./puyosim";

/*
 * Entrypoint
 *
 * Initalizes the simulator.
 */

const puyoSim = new PuyoSim();
$(() => {
  puyoSim.init();
});
