/*
 * Options Panel
 */

var OptionsPanel = Class.extend({

	onloadReady : false,     // If the panel has been loaded
	onloadList  : [],        // Onload functions

	init: function() {
		this.load();
	},

	load: function() { // Loads the options panel
		var self = this;

		$.ajax({
			url      : 'xml/options-panel.xml',
			type     : 'GET',
			dataType : 'xml',
			success  : function(xml) {

				$('#simulator-options-panel').html($(xml).text());

				// Set up the tabs for the options panel
				$('#simulator-options-panel ul.tabs > li a').click(function() {
					$('#simulator-options-panel ul.tabs > li.tab-active').removeClass('tab-active');
					$('#simulator-options-panel .content-active').removeClass('content-active');
					
					$(this).parent().addClass('tab-active');
					$(this.rel).addClass('content-active');
				});
				$('#simulator-options-panel ul.tabs > li:first-child a').click();
				
				// Save saved chains
				$('#save-chain-save').click(function() {
					simulator.savedChains.save($('#save-chain-name').val());
					$('#save-chain-name').val('');
				});
				
				// Display the Loading animation & text for the premade chains
				$('#tab-premade-chains').html(
					"<div class=\"loading-image\"><\/div>"
				);
				
				// Set up all the content in the settings panel
				$('input[name="score-mode"]').change(function() { // Score Mode
					switch ($('input[name="score-mode"]:checked').val())
					{
						case 'classic': simulator.simulation.scoreMode = 0; break;
						case 'fever':   simulator.simulation.scoreMode = 1; break;
					}
				});
				switch (simulator.simulation.scoreMode)
				{
					case 0: $('input[name="score-mode"][value="classic"]').attr('checked', true); break;
					case 1: $('input[name="score-mode"][value="fever"]').attr('checked', true);   break;
				}
				
				// Puyo To Clear
				$('#puyo-to-clear').change(function() {
					simulator.simulation.eraseAmount = parseInt($(this).val()) || Simulation.DefaultEraseAmount;
				});
				for (var i = 2; i <= 6; i++)
					$('<option>').attr('value', i).text(i.toString()).appendTo('#puyo-to-clear');

				$('#puyo-to-clear').val(simulator.simulation.eraseAmount);
				
				// Target Points
				$('#target-points').change(function() {
					simulator.simulation.targetPoints = parseInt($(this).val()) || Simulation.DefaultTargetPoints;
				});
				for (var i = 10; i <= 990; i += 10)
					$('<option>').attr('value', i).text(i.toString()).appendTo('#target-points');
			
				$('#target-points').val(simulator.simulation.targetPoints);
				
				// Point Puyo
				$('#point-puyo-bonus').change(function() {
					simulator.simulation.pointPuyoBonus = parseInt($(this).val()) || Simulation.DefaultPointPuyoBonus;
				});
				$('<option>').attr('value',      50).text(  '50').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',     100).text( '100').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',     300).text( '300').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',     500).text( '500').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',    1000).text(  '1K').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',   10000).text( '10K').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',  100000).text('100K').appendTo('#point-puyo-bonus');
				$('<option>').attr('value',  500000).text('500K').appendTo('#point-puyo-bonus');
				$('<option>').attr('value', 1000000).text(  '1M').appendTo('#point-puyo-bonus');
				
				// Chain Powers
				for (var set = 0; set < ChainPowerValues.length; set++)
				{
					var optgroup = $('<optgroup>');
					$(optgroup).attr('label', ChainPowerValues[set].set);
					for (var powers = 0; powers < ChainPowerValues[set].powers.length; powers++)
					{
						$('<option>')
							.attr('value', set + ',' + powers)
							.text(ChainPowerValues[set].powers[powers].name)
							.appendTo(optgroup);
					}

					$(optgroup).appendTo('#chain-power');
				}
				$('#chain-power').change(function() {
					var value = $('option:selected', this).val().split(',');
					simulator.simulation.chainPower = ChainPowerValues[value[0]].powers[value[1]].values;
				});
				$('#chain-power').val('0,1');

				// Field Size
				for (var w = Field.MinWidth; w <= Field.MaxWidth; w++)
				{
					$('<option>')
						.attr('value', w)
						.text(w)
						.appendTo('#field-size-width');
				}
				for (var h = Field.MinHeight; h <= Field.MaxHeight; h++)
				{
					$('<option>')
						.attr('value', h)
						.text(h)
						.appendTo('#field-size-height');
				}
				$('#set-field-size').click(function() {
					simulator.field.setChain(
						parseInt($('#field-size-width').val()) || Field.DefaultWidth,
						parseInt($('#field-size-height').val()) || Field.DefaultHeight,
						''
					);
				});
				
				$('#field-size-width').val(simulator.field.width);
				$('#field-size-height').val(simulator.field.height);

				// Linking Codes
				$('#generate-linking-codes').click(function() {
					var chain = simulator.field.convertMapToString();
					var w = simulator.field.width;
					var h = simulator.field.height;
					
					if (w == Field.DefaultWidth && h == Field.DefaultHeight)
					{
						if ($("#linking-code-shorten-url").attr("checked")) { // Shorten URL
							self.shortenChainURL("http://puyonexus.net/chainsim/?chain=" + chain);
						} else {
							$('#linking-code-url').text("http://puyonexus.net/chainsim/?chain=" + chain);
						}

						$('#linking-code-image').text('http://puyonexus.net/chainsim/chainimage.php?chain=' + chain);
						$('#linking-code-chainID').text(chain);
					}
					else
					{
						if ($("#linking-code-shorten-url").attr("checked")) { // Shorten URL
							self.shortenChainURL("http://puyonexus.net/chainsim/?w=" + w + "&h=" + h + "&chain=" + chain);
						} else {
							$('#linking-code-url').text("http://puyonexus.net/chainsim/?w=" + w + "&h=" + h + "&chain=" + chain);
						}

						$('#linking-code-image').text('http://puyonexus.net/chainsim/chainimage.php?w=' + w + '&h=' + h + '&chain=' + chain);
						$('#linking-code-chainID').text('(' + w + ',' + h + ')' + chain);
					}
				});

				// Puyo Skin
				// Just do it here instead of using another class
				// Since the puyo skin is part of Display.
				$.each(Puyo.Skin, function(index, value) {
					$('<li>')
						.append($('<input>')
							.attr('type', 'radio')
							.attr('name', 'puyo-skin-selection')
							.attr('id', 'puyo-skin-' + value.id)
							.attr('value', value.id))
						.append($('<label>')
							.attr('for', 'puyo-skin-' + value.id)
							.addClass('puyo-skin')
							.css('background-position', '0px -' + (index * simulator.display.puyo.size) + 'px')
						)
						.appendTo('#puyo-skin-selection');
				});
				
				$('input[name="puyo-skin-selection"]').change(function() {
					simulator.display.setPuyoSkin($('input[name="puyo-skin-selection"]:checked').val());
					localStorage.setItem('chainsim-puyo-skin', $('input[name="puyo-skin-selection"]:checked').val());
				});
				$('input[name="puyo-skin-selection"][value="' + Puyo.Skin[simulator.display.puyo.skin].id + '"]').attr('checked', true);

				// Options Panel onload is now ready. Execute onload scripts
				// Delete scripts as the panel is only loaded once.
				self.onloadReady = true;
				$.each(self.onloadList, function() { this.apply(window); });
				self.onloadList = [];
			},
			error    : function() {
				$('#simulator-options-panel').html('Options Panel could not be loaded.');
			}
		});
	},
	
	shortenChainURL: function(url) { // Shortens the chain URL
		var api = { // API Settings
			longUrl : encodeURIComponent(url), // URL to encode
			login   : "puyonexus", // API Login
			key     : "R_78a3314f3397ad3074f0283611a5bbe9" // API Key
		};
			
		$.getJSON("http://api.bit.ly/v3/shorten?login=" + api.login + "&apiKey=" + api.key + "&longUrl=" + api.longUrl + "&format=json", function(json) {
			if (json.status_code === 200 && json.status_txt === "OK") { // Seems like we have the shortened URL now.
				$("#linking-code-url").text(json.data.url);
			}
		});
	},

	onload: function(func) { // Adds a function to the onload call.
		if (this.onloadReady) func.apply(window);
		else this.onloadList.push(func);
	},
	
	isLoaded: function() { return this.onloadReady; }
});