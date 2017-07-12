<?php
namespace PuyoSim\Common;

class StringUtils
{
    /**
     * Generates a random string of the specified length and alphabet.
     *
     * @param int $length The length of the string
     * @param string $alphabet The alphabet to use
     *
     * @return string The string
     */
    public static function random(int $length, string $alphabet = null): string
    {
        $alphabetLength = $alphabet !== null
            ? strlen($alphabet)
            : 256;

        $str = '';
        for ($i = 0; $i < $length; $i++)
        {
            $str .= $alphabet[random_int(0, $alphabetLength - 1)];
        }

        return $str;
    }
}