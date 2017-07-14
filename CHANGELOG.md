# Changelog
## [4.3.0](https://puyonexus.github.io/puyosim/releases/4.3.0/) (July 11, 2017)

### New features
* Short URLs for shareable chains and images. The URLs take the following format:
    * **Link**: /chain/abc12
    * **Image**: /image/abc12.png
    * **Animated Image**: /image/abc12.gif
* Shareable animated GIFs.
* Open Graph, Twitter Cards, and oEmbed support.

### Changes
* Goodbye Puyo Puyo Chain Simulator, hello PuyoSim!
* Various Puyo Puyo-related terminology has been changed to match their usage in Puyo Puyo Tetris:
    * Field -> Board
    * Nuisance -> Garbage
    * Puyo to Clear -> Pop Limit   
    * Target Points -> Garbage Rate
* Characters have been renamed to match their current names:
    * Dongurigaeru -> Dongiru Gaeru
    * Onion Pixy -> Onion Pixie
    * Raffine -> Raffina
    * Rider -> Lidelle
    * Skeleton T -> Skeleton-T
* The Links tab has been renamed to Share and has been redesigned.
* jQuery updated to 3.2.1.
* Changelog rewritten in Markdown.
* Replaced backend with a new one based on the Slim framework.
* Switched to native system fonts and bumped up the font size from 13px to 14px.
* The maximum width of the body has been increased from 980 pixels to 1,200 pixels.
* The tabs on the side only collapse when there isn't enough room to display them, rather always when the board has more than 6 columns.
* HTTPS used for shareable URLs.
* A chain's name is now called a title.
* Titles on the Saved Chains tab are now escaped.
* Chain format for saved chains has been changed (saved chains created before this version still work as expected).

### Fixes
* Board background is correctly saved.
* Resolved an issue where a dropdown could close shortly after opening it.
* Fixed gaps between Puyos in some skins.

### Removed features
* Support for Internet Explorer < 11 and other browsers that don't support flexbox.
* DOM renderer (All supported browsers support HTML Canvas)
* "Legacy style" URLs when sharing links and images (They are still supported by the chain simulator.)
* Bitly link shortening
* Shareable BBCodes

## [4.2.1](https://puyonexus.github.io/puyosim/releases/4.2.1/) (March 8, 2017)

* Added Puyo Puyo Tetris character backgrounds.
* Added ability to select a character background when the field style is set to Eye Candy.

## [4.2.0](https://puyonexus.github.io/puyosim/releases/4.2.0/) (February 4, 2013)

* The nuisance tray is now displayed using HTML5 Canvas (only if you are using the canvas renderer).
* Added the ability to change the number of hidden rows (either 1 or 2 rows).
* Replaced the delete Puyo icon (the one with the X, not the erasor; that's the erase Puyo icon).
* Fixed a bug where switching from the canvas to DOM renderer while the simulation is running and then pressing back didn't properly update the field.
* Replaced Chain ID with BBCode in the Links tab.
* Changed the look of the field when viewing a non standard size chain using the Eye Candy style.
* Minor changes to the style.
* Internal changes that do not affect the usage of the simulator.
* Other minor changes.

## [4.1.0](https://puyonexus.github.io/puyosim/releases/4.1.0/) (August 7, 2012)

* New look. Looks so much better and more modern than v4.0.0 (which was really just the same as v3.0.x). The field still looks the same.
* Added Sun Puyo (and they're nicely animated as well).
* New nice stylized dropdown menus for Puyo skin selection, chain set selection, and attack power selection. This allows me to use more than just one line of text and use images.
* Removed some code required for legacy browsers. Your browser now needs to support HTML5 DOM Storage (localStorage) and JSON. Due to this, browsers such as IE 7 (and older) and the Wii Internet Browser are no longer supported.
* Eliminated the use of seperate css and xml files for each field style. All their content is stored in the main JavaScript file and a single CSS file. As such the initial loading time when opening the page and the loading time when switching between field displays no longer exists; it's now loads instantly.
* Rewrote some code to clean it up and optimize it.
* Rewrote the code for the saved chains. It goes back to using JSON ala v3.0.x rather than a custom JSON-less method used in v4.0.0.
* Added the new Puyo skins from Puyo Puyo!! 20th Anniversary. There are now 26 different Puyo skins to select from.
* Reordered the Puyo selection.
* Changed the erasor image to the one from 20th Anniversary.
* Replaced "Erase All" with a graphical one ala 20th Anniversary.
* You can now disable Puyo animation. You can still disable the nuisance tray animation and can also disable the Sun Puyo animation.
* Reordered and condensed some of the chain sets (Mini Puyo Fever and Chain Simulator chains are identical in Puyo 7 and 20th Anniversary). This change cuts the chain presets file by around 50KB.
& Removed support for some types of URL's for chain images. URL's such as chainimage.php/000.png are no longer supported.
* Used a darker background for chain images (#444 compared to #FFF).
* New Puyo skin for chain images, ripped from Puyo Puyo Box (it's really the same but the colors resemble Arcade/Mega Drive Puyo Puyo Tsu).
* The changelog is now a nicely formatted HTML file rather than a plain text document.
* Numerous other additional features and changes.

## [4.0.0](https://puyonexus.github.io/puyosim/releases/4.0.0/) (June 18, 2011)

* Complete rewrite, yet again.
* Now supports using HTML5 Canvas to draw the puyo. (It still supports using DOM methods).
* New logo
* Improved look of the options.
* When you select a character's power, the score mode and target points are automatically adjusted.
* Improved scoring, should be 99% accurate now according to Puyo Puyo 7.
* Added animation to the nuisance tray. It can be disabled. (it's enabled by default.)
* Numerous other changes.

## [3.0.2](https://puyonexus.github.io/puyosim/releases/3.0.2/) (February 4, 2011)

* Updated jQuery from 1.4.2 to 1.5. The release version also uses a copy located on Google's CDN instead of a locally hosted one.
    * UPDATE on March 11, 2011 - Updated jQuery to 1.5.1.
* Added URL shortening for the chain URL (this was previously added in v2.2.1 but was removed in v3.)
* Fixed a major bug where loading a chain from a url that contained the width and height parameters set the height incorrectly.
* Fixed bug where switching from an animated puyo skin to a non-animated puyo skin connected the puyo in the hidden top row.
* Changed BBCode in Linking Codes to Chain ID (possible release of a new version of the PPF Fever Editor in the future?) Due to an oversight, the original bbcode didn't even work anyway when the field size wasn't 6x12!
* Changed the way the saved chains are stored. They no longer use JSON and as a result json2.js is no longer needed. Saved chains that are saved using the old way will be converted upon opening the chain simulator. Unfortunately, this new method breaks the old chain simulators when they try to load the saved chains (they encounter a JSON.parse error.)
* Changed the look of the saved chains. There is no longer a Load and Delete button. Now, clicking the chain name will load it, and there is a graphical delete button.
* Reversed the order of the simulation speeds. 1 is now Slow and 9 is now Fast.
* Some minor internal changes.

## [3.0.1](https://puyonexus.github.io/puyosim/releases/3.0.1/) (September 24, 2010)

* Switched doctype from XHTML1.0 Strict to HTML5.
* Old style chain URL's now work.

## [3](https://puyonexus.github.io/puyosim/releases/3/) (August 28, 2010)

* Complete rewrite. Now uses jQuery and OOP.
* New look.
* New simulator skins that replace Standard and Eye Candy from v1 and v2.
    * Basic: Based off of Eye Candy from v1 without the fever backgrounds.
    * Standard: Based off of Eye Candy from v2 without the fever backgrounds and X's. It's also the default skin.
    * Eye Candy: New skin that uses 15th Anniversary and Puyo 7 backgrounds.
* 16x16 puyo removed. All skins now use 32x32 puyo.
* Puyo now connect to each other in the field.
* Puyo skins from Puyo 7 added.
* Classic puyo skin from 15th Anniversary removed as the one in Puyo 7 is identical and of higher quality.
* Classic puyo skin now the default puyo skin.
* Ability to change point value of point puyo (default is 50).
* Added ability to save chains.
* Improved score calculation. Should now be accurate according to Puyo 7.
* Now saves settings using DOM storage if the browser supports it. Otherwise it will still use cookies.
* Removed chain image puyo and skin selections. They will now use Puyo 2 puyo and a random skin.
* Removed code generated for the PPF Fever Editor.
* New query string used for linking codes. (Old style is still used for bbcode.)
    * New: ?w=w&h=h&chain=c
    * Old: ??(w,h)c
* Limited values for puyo to clear and target points.
* Ability to freely switch between classic and fever scoring.
* Added more control to the simulator speed. Also, it has been moved to directly under the controls now.
* Simulation controls redone to be more like Puyo 7. They are also much less wordy.
* "Chain from URL" now only shows up if a chain form the url was used.
* Added 108 chain from Puyo~n. Maybe you should ask KONAMI for the CODE to unlock it.
* To-do:
    * Add chain powers for Puyo 7 Mini and Mega Transformation.
    * Fix bug where you can't place puyo in IE9 Preview. (This might be an IE bug as the wrong mouse button pressed is returned.)
    * Fix problems with Opera for Wii (aka Internet Channel).
    * Finish up my #2 and #3 custom sets.

## [2.2.1](https://puyonexus.github.io/puyosim/releases/2.2.1/) (Unknown release date)

No notes available for this version.

## [2.2](https://puyonexus.github.io/puyosim/releases/2.2/) (October 10, 2009)

* Rewrote the fever chains widget and renamed it the chains widget.
* Added all the chains from Puyo Puyo 7.
* Fixed Puyo Puyo 7 Giant Transformation field size (10x18, not 10x20).
* Improved on the scoring algorithm. It's not perfect, but for the most part it is accurate enough. Just don't make (large) separate groups of the same color and it will be accurate for the most part.
    * Scoring is based off of Puyo Puyo 7 scoring.
* Added url shortening support for the linking code link using bitly.
    * Note that it only works on the online version.
* Renamed "Advance Chain" to "Advance a Step".
* Update the nuisance indicator image to fit into the layout better.
* Cleaned up some code & removed old code.
* Other minor fixes & improvements.

## [2.1](https://puyonexus.github.io/puyosim/releases/2.1/) (July 15, 2009)

No notes available for this version.

## [2](https://puyonexus.github.io/puyosim/releases/2/) (Unknown release date)

No notes available for this version.

## [1](https://puyonexus.github.io/puyosim/releases/1/) (Unknown release date)

No notes available for this version.