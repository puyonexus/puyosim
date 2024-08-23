<?php
namespace PuyoSim\Common;

class ImageUtils
{
    /**
     * Enlarges an image to at least the specified size, maintaining its aspect ratio.
     * The image is only enlarged if it is smaller than the specified width.
     *
     * @param resource $image The image to enlarge
     * @param int $width The minimum width to resize to
     * @param int $height The minimum height to resize to
     *
     * @return resource The enlarged image
     */
    public static function enlarge($image, int $width, int $height)
    {
        $oldWidth = imagesx($image);
        $oldHeight = imagesy($image);

        // If the image is already larger than the specified size, then just return the original image.
        if ($oldWidth >= $width && $oldHeight >= $height)
        {
            return $image;
        }

        if ($oldWidth < $width && $oldHeight < $height)
        {
            $enlargeBy = $oldWidth < $oldHeight
                ? $width / $oldWidth
                : $height / $oldHeight;
        }
        else if ($oldWidth < $width)
        {
            $enlargeBy = $width / $oldWidth;
        }
        else
        {
            $resizeBy = $height / $oldHeight;
        }

        $newWidth = round($oldWidth * $enlargeBy);
        $newHeight = round($oldHeight * $enlargeBy);

        return imagescale($image, $newWidth, $newHeight);
    }

    /**
     * Returns the specified image as a GIF image.
     *
     * @param resource $image The image
     *
     * @return string The image as a GIF
     */
    public static function toGif($image)
    {
        ob_start();
        imagegif($image);
        return ob_get_clean();
    }

    /**
     * Returns the specified image as a PNG image.
     *
     * @param resource $image The image
     *
     * @return string The image as a PNG
     */
    public static function toPng($image)
    {
        ob_start();
        imagepng($image);
        return ob_get_clean();
    }
}
