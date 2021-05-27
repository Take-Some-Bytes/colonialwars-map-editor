# Colonial Wars Map Editor Changelog
Changelog for ``colonialwars-server``.

The format is based on [Keep a Changelog][1], and this project adheres to [Semantic Versioning][2].

## [v0.2.0] - 2021-05-30
### Added:
- Added more map configuration options:
  * Game mode: specify the game mode of the map;
  * Unit, Building, Graphics data: specify whatever unit, building, or graphics data the map needs.
- Added the editor toolbar. Now you could quit the editor, create new maps while in the editor,
and save your map that you created.
- Added a loading screen that shows when the editor is initializing.
- Added new icons for the editor toolbar.
- Added a ``detachEventListeners`` on the ``InputTracker`` and ``InputManager``
classes--this way, the application could decided to stop tracking input at any time.
- Added a ``MapConfig`` class to manage Colonial Wars Map Configurations, conforming to
[Draft Revision 3 of CW File Structures](
  https://github.com/Take-Some-Bytes/specifications/blob/670516e5ce46eee98c5843365c1f21e7eecb4ae0/colonialwars/cw-file-structures.md
).
- Added methods to suspend and unsuspend the map editor.
### Changed:
- Changed project layout a bit.
- Changed HTML structure of custom React select menu.
- Changed map drawing logic, and removed unneeded complexity.
- Started using the ``debug`` module in our code. Also removed all instances of ``console.debug``
with calls to the ``debug ``module.
- Re-structured the code for the new map modal.
### Fixed:
- Fixed a potential memory leak in the ``openFiles`` method--before, the promise that was
returned would stay pending indefinitely because it didn't have a way of knowing
if the user clicked Cancel.

## [v0.1.1] - 2021-03-26
### Fixed:
- Fixed the very annoying number inputs--before, they would bind a number to its
bounds immediately, after every change, which produced some very annoying results
(e.g. I try to enter 100, but when I select the number and press backspace, it
immediately displays 50 instead). Now, the inputs only bind their values on blur.
- Fixed the selectable canvas. The canvas is now unselectable.

## [v0.1.0] - 2021-02-14
- Initial (pre-)release.

[1]: https://keepachangelog.com/
[2]: https://semver.org

[v0.1.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/ee64c8cac332995c587977e61df96d1ec37c9adf
[v0.1.1]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/032e468d5a309f89d984cf74c736b8b40b63fe4e
[v0.2.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/main
