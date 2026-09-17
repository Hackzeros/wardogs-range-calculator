# WarDogs Range Calculator

A fast, client-side mortar and artillery range calculator for **WarDogs**. Paste a weapon position and target position directly from the game to get the straight-line range in meters immediately.

**Live calculator:** https://hackzeros.github.io/wardogs-range-calculator/

> This is an unofficial community tool and is not affiliated with the WarDogs developers or publisher.

## Use it

1. Paste the weapon position into **Weapon Position**.
2. Paste the destination into **Target Position**.
3. Read the automatically calculated range.

The calculator accepts the coordinate format copied by WarDogs:

```text
x98.43, y110.38
```

Uppercase labels, extra whitespace, compact comma spacing, and negative coordinates are supported. Invalid fields are identified instead of being calculated.

The weapon position is saved in your browser so an established mortar or artillery location survives a refresh. The target position is not saved.

## In-game workflow

1. Open the WarDogs map.
2. Right-click the desired location.
3. Choose **Mark Coordinates**.
4. The coordinates appear in chat.
5. Press **Ctrl+A**.
6. Press **Ctrl+C**.
7. Paste into the calculator.

Repeat for the target position. The displayed range updates without a Calculate button.

## Calculation

WarDogs coordinate units represent approximately 100 meters. The calculator uses Euclidean distance:

```text
distance = sqrt((x2 - x1)^2 + (y2 - y1)^2) * 100
```

The displayed result is rounded to the nearest whole meter.

Example:

```text
Weapon: x102.50, y87.25
Target: x106.50, y90.25
Range:  500 m
```

## Run locally

No installation, dependencies, backend, or build step are required. Download or clone the repository and open `index.html` in a modern browser.

For a local HTTP server instead:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Tests

The parsing and distance logic use Node's built-in test runner:

```bash
node --test tests/calculator.test.js
```

## License

[MIT](LICENSE)
