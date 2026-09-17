'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  parseCoordinates,
  calculateDistanceMeters,
} = require('../script.js');

test('parses the standard WarDogs coordinate format', () => {
  assert.deepEqual(parseCoordinates('x98.43, y110.38'), { x: 98.43, y: 110.38 });
});

test('accepts uppercase labels and extra whitespace', () => {
  assert.deepEqual(parseCoordinates('  X  102.50  ,   Y  87.25  '), { x: 102.5, y: 87.25 });
});

test('accepts negative coordinates and compact comma spacing', () => {
  assert.deepEqual(parseCoordinates('x-12.5,y -0.25'), { x: -12.5, y: -0.25 });
});

test('accepts signed and leading-decimal coordinate values', () => {
  assert.deepEqual(parseCoordinates('x +.5, y -.25'), { x: 0.5, y: -0.25 });
});

test('rejects malformed and partially valid input', () => {
  assert.equal(parseCoordinates('98.43, 110.38'), null);
  assert.equal(parseCoordinates('x98.43, y'), null);
  assert.equal(parseCoordinates('x98.43, y110.38 extra'), null);
  assert.equal(parseCoordinates(''), null);
});

test('calculates and rounds the known 500 meter range', () => {
  const weapon = parseCoordinates('x102.50, y87.25');
  const target = parseCoordinates('x106.50, y90.25');
  assert.equal(calculateDistanceMeters(weapon, target), 500);
});

test('rounds the second known example to 413 meters', () => {
  const weapon = parseCoordinates('x98.43, y110.38');
  const target = parseCoordinates('x94.53, y109.03');
  assert.equal(calculateDistanceMeters(weapon, target), 413);
});

test('returns zero for identical coordinates', () => {
  const point = parseCoordinates('x10, y-20');
  assert.equal(calculateDistanceMeters(point, point), 0);
});
