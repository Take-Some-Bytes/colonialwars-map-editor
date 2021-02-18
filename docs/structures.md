# Save File Structures
Structures of Colonial Wars save files.
Revision number 1.

## Map Save File structure
Structure of Colonial Wars map save files.
```jsonc
{
  "configType": "game-config", // Must be "game-config"
  "meta": {
    "name": "Valley", // Must only have alphanumerical characters and spaces
    "mode": "Teams", // Either Teams, KOTH, or Siege
    "maxPlayers": 40, // Must be a positive integer
    "worldLimits": {
      // Must have x and y, and those properties must have a number describing
      // the maximums for each axis.
      "x": 6000,
      "y": 6000
    },
    "startPositions": {
      // Must contain an object with alphanumerical object keys and
      // property values corresponding to { "x": number, "y": number }
      "British": { "x": 250, "y": 250 },
      "French": { "x": 5750, "y": 5750 },
      "American": { "x": 3000, "y": 3000 }
    },
    "unitDataExtends": "default", // Must be "default" or a valid file path
    "tileDataExtends": "default", // Must be "default" or a valid file path
    "buildingDataExtends": "default", // Must be "default" or a valid file path
    "obstacleDataExtends": "default" // Must be "default" or a valid file path
  }
}
```
