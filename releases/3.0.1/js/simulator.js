/*
 * Simulator
 */

(function() {
	$(document).ready(function() {
		var simulator = {};
		window.simulator = simulator;
		
		simulator.display      = new Display(); // Initalize the display
		simulator.optionsPanel = new OptionsPanel(); // Initalize the options panel

		simulator.simulation  = new Simulation();
		simulator.field       = new Field();

		simulator.savedChains = new SavedChains();
		simulator.chain       = new PremadeChains();
	});
})();