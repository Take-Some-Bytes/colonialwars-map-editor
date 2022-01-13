# Colonial Wars Map Editor
This is ``colonialwars-map-editor``, an optional component of Colonial Wars.
This repository includes:
- A ``React`` frontend application to edit maps that follow the CW file structures
specification as defined [here](
  https://github.com/Take-Some-Bytes/specifications/blob/main/colonialwars/cw-file-structures.md
).

This application is completely optional. It is only meant to help with the creation and
editing of Colonial Wars maps.

## Compatibility
The save files that can be opened by this application currently follows an ***unstable version***
of Colonial Wars save files. Compatibility with ``colonialwars-server`` is not guaranteed.

## Running the Development Server
The development server is powered by [``snowpack``](https://npmjs.com/package/snowpack).
To start it up, just run:
```sh
npm start
```
A new browser tab will open once snowpack has completed its work.

Make sure you have Node.JS [installed](https://nodejs.org), with a version that satisfies
the [``engines``](https://github.com/Take-Some-Bytes/colonialwars-client/blob/main/package.json#L26)
field (currently Node.JS 12 and up).
