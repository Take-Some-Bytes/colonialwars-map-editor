# Colonial Wars Map Editor Changelog
Changelog for ``colonialwars-server``.

The format is based on [Keep a Changelog][1], and this project adheres to [Semantic Versioning][2],
with the exception that this project does *not* expose a public API.

<!--
  When releasing a new version: 
    - Ensure all updateable dependencies are updated.
    - Add changelog entries for important things that changed.
    - Bump version in package.json.
    - Update compatibility table in README.md if needed.
-->

## [Unreleased]
**PROJECT MAINTAINERS**: The required Node.JS versions has been updated. Only Node.JS 14 and 16
are supported now. This is due to the switch from ``snowpack`` to ``vite``.

### Added:
- \[[``0c8c20f7``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/0c8c20f7)\]
Added the "Player Config" modal for editing player (aka commander) properties.
- \[[``aed32011``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/aed32011)\]
Added a placeholder graphic for the player unit, aka the commander.
- \[[``1cd48e17``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/1cd48e17)\] **PROJECT MAINTAINERS**:
Added [``colonialwars-lib``](https://github.com/Take-Some-Bytes/colonialwars-lib) as a dependency
to reduce code duplication.
- \[[``ee6dc924``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/ee6dc924)\] **PROJECT MAINTAINERS**:
Added code to handle failed deletions in the ``ItemEditor``.

### Changed:
- \[[``1e7d2bda``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/1e7d2bda)\] **PROJECT MAINTAINERS**:
Migrated from ``snowpack`` to [``vite``](https://npmjs.com/package/vite).
- \[[``fbd03be0``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/fbd03be0)\] **PROJECT MAINTAINERS**:
Upgraded to React 18.

## [v0.5.0] - 2022-04-17
### Added:
- \[[``cf9e1d60``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/cf9e1d60)\]
Added a colour picker component. Unlike the default HTML colour picker, this one, built
top of ``react-color``, supports an alpha (transparency) channel.
- \[[``5f200555``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/5f200555)\]
Added basic modifier editing.
- \[[``f90ac74b``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/f90ac74b)\] **PROJECT MAINTAINERS**:
Added [``react-color``](https://npmjs.com/package/react-color) as a dependency. See
above for details.

### Changed:
- \[[``51f7dd4b``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/51f7dd4b)\]
The map size inputs of the "New Map" modal now only takes integers. This is to prevent
users from entering odd map sizes.
- \[[``a069ab1c``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/a069ab1c)\] **PROJECT MAINTAINERS**:
Moved app version to constants.

### Fixed:
- \[[``ce763e26``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/ce763e26)\]
Fixed file picking. Sometimes the file picker failed even when a file was picked.

## [v0.4.2] - 2021-12-24
### Changed:
- \[[``a66bee44``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/a66bee44)\]
Reworked sand tile.
- \[[``d6f6121b``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/d6f6121b)\]
Downsized modal sizes.
- \[[``e0dc6753``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/e0dc6753)\]
Improved look of modal close buttons.
- \[[``cc32c412``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/cc32c412)\]
Graphics modal now automatically removes decimal points when user stops editing numerical inputs
of a graphic.
- \[[``b96866de``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/b96866de)\]
Scrollbars are now shown only if needed in the display section of item editors.
- \[[``212bca97``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/212bca97)\]
Displayed team spawn coordinates in the "New Team Modal" the same way as the "Teams Modal" 
(decimals instead of huge numbers.)
- \[[``dda78eaa``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/dda78eaa)\] **PROJECT MAINTAINERS**: 
Used [``joi``](https://www.npmjs.com/package/joi) instead of custom validation functions.
- \[[``edd971fa``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/edd971fa)\] **PROJECT MAINTAINERS**:
Refactored delete/close button code into different file.

### Fixed:
- \[[``5fbbb2c5``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/5fbbb2c5)\]
The "New Team" modal now creates completely valid teams.
- \[[``dd235754``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/dd235754)\]
The striped input tables of all item editors (i.e. teams modal, graphics modal) have been fixed.
Their background stripes now extend all the way past the widest row in the table.

### Removed:
- \[[``d10812e5``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/d10812e5)\] **PROJECT MAINTAINERS**:
Removed item limiting logic from the ``ItemEditor`` component. The ``ItemEditor`` no longer allows
users to configure a maximum or minimum for items.

## [v0.4.1] - 2021-09-17
### Changed:
- \[[``b6f9825f``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/b6f9825f)\]
Displayed team spawn coordinates as decimals instead of huge numbers. For example, ``6000``
will now be displayed as ``60.00`` (without the trailing zeroes).
- \[[``76834f98``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/76834f98)\]
Put the text ``PROJECT MAINTAINERS`` before any changes that are only interesting to
project maintainers.
- \[[``5e9d7126``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/5e9d7126)\]
Rework grass tile.
- \[[``77342d80``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/77342d80)\]
**PROJECT MAINTAINERS**: Updated [``@szhsin/react-menu``](https://www.npmjs.com/package/@szhsin/react-menu)
to the 2.x release line. This is a breaking dependency change.

### Fixed:
- \[[``e9057577``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/e9057577)\]
The map editor used to crash when an invalid character is entered into the map name input.
That no longer happens--instead, the invalid character is silently ignored.
- \[[``fd53e81f``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/fd53e81f)\]
If the user clicked cancel while selecting a file, the hidden file input will still exist
in the DOM tree. The file input is now removed correctly.
- \[[``432271c1``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/432271c1)\]
Release notes of v0.4.0 now state that graphics editing were added.
- \[[``a37377fe``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/a37377fe)\]
Date of release v0.4.0 was actually documented.

## [v0.4.0] - 2021-08-09
### Added:
- \[[``e98b711c``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/e98b711c)\]
Added functionality to edit the graphics of a Colonial Wars map.
  * The "Map Graphics" modal was added to display and make it possible to edit map graphics.
  * The "New Graphic" modal was added to allow users to add graphics.

  Graphics are limited to 1500 per map. Graphics may only use images that the application provides.
- \[[``9be51bcd``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/9be51bcd)\]
Added new button so maps could now be loaded from the editor toolbar.
- \[[``1876d3cc``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/1876d3cc)\] **PROJECT MAINTAINERS**:
Added new ``ItemEditor`` component to make creating modals that edit items more convenient.
- \[[``6db5f15f``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/6db5f15f)\] **PROJECT MAINTAINERS**:
Added new ``BoundMap`` class, which exposes a ``Map``-like API, except all keys must be
strings, and storage of values is done in a user-provided object.

### Changed:
- \[[``95b9edef``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/95b9edef)\]
Used relative positioning/dimensions in CSS where applicable.
- \[[``fc323a3a``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/fc323a3a)\]
Used relative positioning/dimensions in CSS and JSX components where applicable.
- \[[``d3befd20``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/d3befd20)\]
Menus in the editor toolbar now close whenever another menu is opened.
- \[[``aada89b1``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/aada89b1)\] **PROJECT MAINTAINERS**:
The ``MapSettingsModal`` has been renamed to ``SettingsModal``.
- \[[``b2cebb79``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/b2cebb79)\] **PROJECT MAINTAINERS**:
The ``Menu`` component now accepts menu open/close hooks, allowing you to
run code when a menu opens/closes.
- \[[``685ac4ac``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/685ac4ac)\] **PROJECT MAINTAINERS**:
The code for loading maps has now been moved to ``loaders.js``.
- \[[``1a9c5408``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/1a9c5408)\] **PROJECT MAINTAINERS**:
Overhauled ``InputManager`` class and input handling.
- \[[``5193f288``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/5193f288)\] **PROJECT MAINTAINERS**:
The row name styles of the ``TwoColTable`` component could now be customized.

### Fixed:
- \[[``23ba0cde``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/23ba0cde)\]
Modals used to be able to be dragged by their footer. That is no longer the case.

## [v0.3.0] - 2021-06-26
### Added:
- \[[``eb0f9763``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/eb0f9763)\]
Added functionality to edit the teams of a Colonial Wars map.
  * The "Map Teams" modal was added to display and make it possible to edit map teams.
  * The "New Team" modal was added to allow users to add teams.

  Teams are limited to 8 per map.
- \[[``e11ba659``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/e11ba659)\]
Added a modal to modify general map settings (map name and description).
- \[[``922bbe3a``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/922bbe3a)\] **PROJECT MAINTAINERS**:
Added tooltips (via [``react-tooltip``](https://www.npmjs.com/package/react-tooltip))
to various components of the editor.
- \[[``eef9975a``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/eef9975a)\] **PROJECT MAINTAINERS**:
Added more UI components for React:
  * ``TwoColTable``, which renders a table that only has two rows.
  * ``RadioList``, which renders a list of radio buttons.

### Changed:
- \[[``9e1c0394``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/9e1c0394)\] **PROJECT MAINTAINERS**:
The ``Button`` React component is now a bit more customizable, providing you with the
ability to specify button size, additional CSS class names, and additional CSS styles.
- \[[``e6243dd9``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/e6243dd9)\] **PROJECT MAINTAINERS**:
Editor input tracker does not prevent the default behaviour of ``keydown``, ``keyup``,
``mousedown``, and ``mouseup`` anymore.

### Deprecated:
- \[[``5a4ab903``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/5a4ab903)\] **PROJECT MAINTAINERS**:
Non-[BEM](http://getbem.com)-styled CSS classes are now *deprecated*. New CSS classes MUST follow
the BEM methodology.

## [v0.2.0] - 2021-05-30
### Added:
- \[[``90038b87``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/90038b87)\] 
Added more map configuration options:
  * Game mode: specify the game mode of the map;
  * Unit, Building, Graphics data: specify whatever unit, building, or graphics data the map needs.
- \[[``7400d335``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/7400d335)\]
Added the editor toolbar. Now you could quit the editor, create new maps while in the editor,
and save your map that you created.
- \[[``133edb41``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/133edb41)\]
Added a loading screen that shows when the editor is initializing.
- \[[``4a344e7b``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/4a344e7b)\] **PROJECT MAINTAINERS**:
Added ``debug`` module for debug output.
- \[[``5d62bfc4``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/5d62bfc4)\] **PROJECT MAINTAINERS**:
Added a ``detachEventListeners`` on the ``InputTracker`` and ``InputManager``
classes--this way, the application could decided to stop tracking input at any time.
- \[[``f62f9f6a``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/f62f9f6a)\] **PROJECT MAINTAINERS**:
Added a ``MapConfig`` class to manage Colonial Wars Map Configurations, conforming to
[Draft Revision 3 of CW File Structures](
  https://github.com/Take-Some-Bytes/specifications/blob/670516e5ce46eee98c5843365c1f21e7eecb4ae0/colonialwars/cw-file-structures.md
).
- \[[``6b698559``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/6b698559)\] **PROJECT MAINTAINERS**:
Added methods to suspend and unsuspend the map editor.

### Changed:
- \[[``608c6341``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/608c6341)\] **PROJECT MAINTAINERS**:
Changed HTML structure of custom React select menu.
- \[[``c3d6b389``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/c3d6b389)\] **PROJECT MAINTAINERS**:
Changed map drawing logic, and removed unneeded complexity.
- \[[``90038b87``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/90038b87)\] **PROJECT MAINTAINERS**:
Re-structured the code for the new map modal.

### Fixed:
- \[[``f94bc534``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/f94bc534)\] **PROJECT MAINTAINERS**: 
Fixed a potential memory leak in the ``openFiles`` method--before, the promise that was returned would
stay pending indefinitely because it didn't have a way of knowing if the user clicked Cancel.

## [v0.1.1] - 2021-03-26
### Fixed:
- \[[``8dc4cb75``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/8dc4cb75)\] Fixed the very
annoying number inputs--before, they would bind a number to its bounds immediately after every change, which
produced some very annoying results (e.g. I try to enter 100, but when I select the number and press backspace,
it immediately displays 50 instead). Now, the inputs only bind their values on blur.
- \[[``9a10661d``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/9a10661d)\] Fixed the selectable 
canvas. The canvas is now unselectable.

## [v0.1.0] - 2021-02-14
- \[[``c6b6c55a``](https://github.com/Take-Some-Bytes/colonialwars-map-editor/commit/c6b6c55a)\] Initial (pre-)release.

[1]: https://keepachangelog.com/
[2]: https://semver.org

[v0.1.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/ee64c8cac332995c587977e61df96d1ec37c9adf
[v0.1.1]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/032e468d5a309f89d984cf74c736b8b40b63fe4e
[v0.2.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/10b65a0a79d4d1766ec53c0ed9b97b8289524132
[v0.3.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/17e7411c44c287271522ed3d7c16e0f315e63a25
[v0.4.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/b7b44d16be914311a31a9363b0bba85be4ff6cac
[v0.4.1]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/0b7553416554695ed5fdeb2949bbc5f7f460d185
[v0.4.2]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/8b5600303d046fc515796f866fdbf4e785401d00
[v0.5.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/b5e714a9b0a242e70fd2eefa33c9d93d46d6d65f
[Unreleased]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/main
