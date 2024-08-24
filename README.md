# PuyoSim
PuyoSim is the name of the Puyo Puyo chain simulator used on Puyo Nexus.

PuyoSim was originally written by [Nick Woronekin](https://github.com/nickworonekin).

## Features
* Standard Puyo types plus others only seen in specific rules or games
* Board sizes ranging from 3x6 to 16x26
* Adjustable simulation settings to match various rules
* Customizable board and Puyo skins
* Shareable chains, along with images and animated images
* Local saving
* Selectable chains and attack powers seen in the official Puyo Puyo games

## Releases
The current version of PuyoSim is 4.3.0, which can be seen on [Puyo Nexus](https://puyonexus.com/chainsim/). See the [changelog](CHANGELOG.md) for changes between versions and the [release archive](https://puyonexus.github.io/puyosim/releases/) to play with previous versions.

## Development

### JavaScript

To compile the JavaScript components, you will need NodeJS. Install the dependencies:

```sh
$ npm i
```

Then run Webpack to compile:

```sh
$ npx webpack
```

### PHP

You can initialize a local SQLite database using the SQLite3 CLI. This only needs to be done once.

```sh
$ sqlite3 db.sqlite3 <resources/sql/puyosim-sqlite.sql
```

To run the local development server, you can use the built-in PHP web server:

```sh
$ php -S 0.0.0.0:8080 -t public ./public/index.php
```

To customize settings, e.g. use a different database engine, you can create a file at `config/localsettings.php` which returns values to override the settings in `config/settings.php`.
