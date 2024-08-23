<?php
/* Constructs an animated gif from a set of frames. This code is based on
 * anim-gif originally developed by Clément Guillemain.
 *
 * Copyright (C) 2012 Clément Guillemain
 * Copyright (C) 2014-2017 Szabolcs Szász
 * Copyright (C) 2020 Yannick de Lange
 * Copyright (C) 2024 John Chadwick
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version. This program is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 * Public License for more details. You should have received a copy of the GNU
 * General Public License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */

namespace PuyoSim\Common;

class AnimGif
{
    const VERSION = '1.3+';
	const DEFAULT_DURATION = 10;

	/**
	* @var string: The generated (binary) image
	*/
	private $gif;

	/**
	* @var boolean: Has an image (frame) been added already?
	*/
	private $imgBuilt;

	/**
	* @var array or string: Frame sources like filenames, URLs, bin. data, or a folder name
	*/
	private $frameSources;

	/**
	* @var integer: Gif loop count
	*/
	private $loop;

	/**
	* @var integer: Gif frame disposal method
	*/
	private $dis;

	/**
	* @var integer: Gif transparent color index
	*/
	private $transparent_color;

	/**
	* @var array
	*/
	private static $errors;

	// Methods
	// ===================================================================================

	public function __construct()
	{
		$this->reset();

		self::$errors = array(
			'ERR00' => 'Need at least 2 frames for an animation.',
			'ERR01' => 'Resource is not a GIF image.',
			'ERR02' => 'Only image resource variables, file paths, URLs or binary bitmap data are accepted.',
			'ERR03' => 'Cannot make animation from animated GIF.',
			'ERR04' => 'Loading from URLs is disabled by PHP.',
			'ERR05' => 'Failed to load or invalid image (dir): "%s".',
		);
	}

	/**
	 * Create animated GIF from source images
	 *
	 * @param array $frames The source iamges: can be a local dir path, or an array
	 *                      of file paths, resource image variables, binary data or image URLs.
	 * @param array|number $durations The duration (in 1/100s) of the individual frames,
	 *                      or a single integer for each one.
	 * @param integer $loop Number of loops before stopping the animation (set to 0 for infinite looping).
	 *
	 * @return string The resulting GIF binary data.
	 */
	public function create($frames, $durations = self::DEFAULT_DURATION, $loop = 0)
	{
		$last_duration = self::DEFAULT_DURATION; // used only if $durations is an array

		$this->loop = ($loop > -1) ? $loop : 0; // Negatives would be fine for the GIF itself (all unsigned!),
		                                        // but better not take a chance with the PHP bit-ops...
		$this->dis = 2; // "reset to bgnd." (http://www.matthewflickinger.com/lab/whatsinagif/animation_and_transparency.asp)

		// Check if $frames is a dir; get all files in ascending order if yes (else die):
		if (!is_array($frames)) {
			$frames_dir = $frames;
			if (@is_dir($frames_dir)) {
				if ($frames = scandir($frames_dir)) {
					$frames = array_filter($frames, function($x) {
						// Should these two below be selectable?
						return $x[0] != "."; // Or: $x != "." && $x != "..";
					});

					array_walk($frames, function(&$x, $i) use ($frames_dir) {
						$x = "$frames_dir/$x"; });
				}
			}

			if (!is_array($frames)) { // i.e. scandir() failed above!
				throw new \Exception(self::VERSION.': '
					. sprintf(self::$errors['ERR05'], $frames_dir)); // $frames is expected to be a string here; see the other ERR05 case!
			}
		}

		assert(is_array($frames));

		if (sizeof($frames) < 2) {
			throw new \Exception(self::VERSION.': '.self::$errors['ERR00']);
		}

		$i = 0;
		foreach ($frames as $frame) {
			if ($frame instanceof \GdImage) { // in-memory image resource (hopefully)

				$resourceImg = $frame;

				ob_start();
				imagegif($frame);
				$this->frameSources[] = ob_get_contents();
				ob_end_clean();

				if (substr($this->frameSources[$i], 0, 6) != 'GIF87a' && substr($this->frameSources[$i], 0, 6) != 'GIF89a') {
					throw new \Exception(self::VERSION.': '.$i.' '.self::$errors['ERR01']);
				}

			} elseif (is_string($frame)) { // file path, URL or binary data

				if (@is_readable($frame)) { // file path
					$bin = file_get_contents($frame);
				} else if (filter_var($frame, FILTER_VALIDATE_URL)) {
 					if (ini_get('allow_url_fopen')) {
						$bin = @file_get_contents($frame);
					} else {
						throw new \Exception(self::VERSION.': '.$i.' '.self::$errors['ERR04']);
					}
				} else {
					$bin = $frame;
				}

				if (! ($bin && ($resourceImg = imagecreatefromstring($bin))) )
				{
					throw new \Exception(self::VERSION.': '.$i.' '
						. sprintf(self::$errors['ERR05'], substr($frame, 0, 200))); //!! $frame may be binary data, not a name!
				}

				ob_start();
				imagegif($resourceImg);
				$this->frameSources[] = ob_get_contents();
				ob_end_clean();

			} else { // Fail
				throw new \Exception(self::VERSION.': '.self::$errors['ERR02']);
			}

			if ($i == 0) {
				$this->transparent_color = imagecolortransparent($resourceImg);
			}

			for ($j = (13 + 3 * (2 << (ord($this->frameSources[$i] [ 10 ]) & 0x07))), $k = TRUE; $k; $j++) {

				switch ($this->frameSources[$i] [ $j ]) {

					case '!':
		    				if ((substr($this->frameSources[$i], ($j + 3), 8)) == 'NETSCAPE') {

							throw new \Exception(self::VERSION.': '.self::$errors['ERR03'].' ('.($i + 1).' source).');
						}

						break;

					case ';':
		    				$k = false;
						break;
				}
			}

			unset($resourceImg);

			++$i;
		}//foreach


		$this->gifAddHeader();

		for ($i = 0; $i < count($this->frameSources); $i++) {

			// Reuse the last delay if none has been specified for the current frame.
			if (is_array($durations)) {
				$d = (empty($durations[$i]) ? $last_duration : $durations[$i]);
				$last_duration = $d;
			} else {
				$d = $durations;
			}

			$this->addGifFrames($i, $d);
		}

		$this->gifAddFooter();

		return $this;
	}

	/**
	 * Get the resulting GIF image binary
	 *
	 * @return string
	 */
	public function get()
	{
		return $this->gif;
	}

	/**
	 * Save the resulting GIF to a file.
	 *
	 * @param $filename String Target file path
	 *
	 * @return that of file_put_contents($filename)
	 */
	public function save($filename)
	{
		return file_put_contents($filename, $this->gif);
	}

	/**
	 * Clean-up the current object (also used by the ctor.)
	 */
	public function reset()
	{
		$this->frameSources = null;
		$this->gif = 'GIF89a'; // the GIF header
		$this->imgBuilt = false;
		$this->loop = 0;
		$this->dis = 2;
		$this->transparent_color = -1;
	}

	// Internals
	// ===================================================================================

	/**
	 * Assemble the GIF header
	 */
	protected function gifAddHeader()
	{
		$cmap = 0;

		if (ord($this->frameSources[0] [ 10 ]) & 0x80) {

			$cmap = 3 * (2 << (ord($this->frameSources[0] [ 10 ]) & 0x07));

			$this->gif .= substr($this->frameSources[0], 6, 7);
			$this->gif .= substr($this->frameSources[0], 13, $cmap);
			if ($this->loop !== 1) // Only add the looping extension if really looping
				$this->gif .= "!\xFF\x0BNETSCAPE2.0\x03\x01".word2bin($this->loop==0?0:$this->loop-1)."\x0";
		}
	}

	/**
	 * Add frame to the GIF data
	 *
	 * @param integer $i: index of frame source
	 * @param integer $d: delay time (frame display duration)
	 */
	protected function addGifFrames($i, $d)
	{
		$Locals_str = 13 + 3 * (2 << (ord($this->frameSources[ $i ] [ 10 ]) & 0x07));

		$Locals_end = strlen($this->frameSources[$i]) - $Locals_str - 1;
		$Locals_tmp = substr($this->frameSources[$i], $Locals_str, $Locals_end);

		$Global_len = 2 << (ord($this->frameSources[0 ] [ 10 ]) & 0x07);
		$Locals_len = 2 << (ord($this->frameSources[$i] [ 10 ]) & 0x07);

		$Global_rgb = substr($this->frameSources[ 0], 13, 3 * (2 << (ord($this->frameSources[ 0] [ 10 ]) & 0x07)));
		$Locals_rgb = substr($this->frameSources[$i], 13, 3 * (2 << (ord($this->frameSources[$i] [ 10 ]) & 0x07)));

		$Locals_ext = "!\xF9\x04" . chr(($this->dis << 2) + 0) . word2bin($d) . "\x0\x0";

		if ($this->transparent_color > -1 && ord($this->frameSources[$i] [ 10 ]) & 0x80) {

			for ($j = 0; $j < (2 << (ord($this->frameSources[$i] [ 10 ] ) & 0x07)); $j++) {

				if (ord($Locals_rgb [ 3 * $j + 0 ]) == (($this->transparent_color >> 16) & 0xFF) &&
					ord($Locals_rgb [ 3 * $j + 1 ]) == (($this->transparent_color >> 8) & 0xFF) &&
					ord($Locals_rgb [ 3 * $j + 2 ]) == (($this->transparent_color >> 0) & 0xFF)
				) {
					$Locals_ext = "!\xF9\x04".chr(($this->dis << 2) + 1).chr(($d >> 0) & 0xFF).chr(($d >> 8) & 0xFF).chr($j)."\x0";
					break;
				}
			}
		}

		switch ($Locals_tmp [ 0 ]) {

			case '!':

				$Locals_img = substr($Locals_tmp, 8, 10);
				$Locals_tmp = substr($Locals_tmp, 18, strlen($Locals_tmp) - 18);

				break;

			case ',':

				$Locals_img = substr($Locals_tmp, 0, 10);
				$Locals_tmp = substr($Locals_tmp, 10, strlen($Locals_tmp) - 10);

				break;
		}

		if (ord($this->frameSources[$i] [ 10 ]) & 0x80 && $this->imgBuilt) {

			if ($Global_len == $Locals_len) {

				if ($this->gifBlockCompare($Global_rgb, $Locals_rgb, $Global_len)) {

					$this->gif .= $Locals_ext.$Locals_img.$Locals_tmp;

				} else {

					$byte = ord($Locals_img [ 9 ]);
					$byte |= 0x80;
					$byte &= 0xF8;
					$byte |= (ord($this->frameSources[0] [ 10 ]) & 0x07);
					$Locals_img [ 9 ] = chr($byte);
					$this->gif .= $Locals_ext.$Locals_img.$Locals_rgb.$Locals_tmp;
				}

			} else {

				$byte = ord($Locals_img [ 9 ]);
				$byte |= 0x80;
				$byte &= 0xF8;
				$byte |= (ord($this->frameSources[$i] [ 10 ]) & 0x07);
				$Locals_img [ 9 ] = chr($byte);
				$this->gif .= $Locals_ext.$Locals_img.$Locals_rgb.$Locals_tmp;
			}

		} else {

			$this->gif .= $Locals_ext.$Locals_img.$Locals_tmp;
		}

		$this->imgBuilt = true;
	}

	/**
	 * Add the gif string footer char
	 */
	protected function gifAddFooter()
	{
		$this->gif .= ';';
	}

	/**
	 * Compare two blocks and return 1 if they are equal, 0 if differ.
	 *
	 * @param string $globalBlock
	 * @param string $localBlock
	 * @param integer $length
	 *
	 * @return integer
	 */
	protected function gifBlockCompare($globalBlock, $localBlock, $length)
	{
		for ($i = 0; $i < $length; $i++) {

			if ($globalBlock [ 3 * $i + 0 ] != $localBlock [ 3 * $i + 0 ] ||
			    $globalBlock [ 3 * $i + 1 ] != $localBlock [ 3 * $i + 1 ] ||
			    $globalBlock [ 3 * $i + 2 ] != $localBlock [ 3 * $i + 2 ]) {

				return 0;
			}
		}

		return 1;
	}

}

/**
 * Convert an integer to 2-byte little-endian binary data
 *
 * @param integer $word Number to encode
 *
 * @return string of 2 bytes representing @word as binary data
 */
function word2bin($word)
{
	return (chr($word & 0xFF).chr(($word >> 8) & 0xFF));
}
