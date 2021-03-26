# Colonial Wars Map Editor Changelog
Changelog for ``colonialwars-server``.

The format is based on [Keep a Changelog][1], and this project adheres to [Semantic Versioning][2].

## [v0.1.1] - 2021-03-26
### Fixed:
- Fixed the very annoying number inputs--before, they would bind a number to its
bounds immediately, after every change, which produced some very annoying results
(e.g. I try to enter ``100``, but when I select the number and press backspace, it
immediately displays 50 instead). Now, the inputs only bind their values on blur.
- Fixed the selectable canvas. The canvas is now unselectable.

## [v0.1.0] - 2021-02-14
- Initial (pre-)release.

[1]: https://keepachangelog.com/
[2]: https://semver.org

[v0.1.0]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/ee64c8cac332995c587977e61df96d1ec37c9adf
[v0.1.1]: https://github.com/Take-Some-Bytes/colonialwars-map-editor/tree/main
