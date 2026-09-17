'use strict';

function parseCoordinates(value) {
  if (typeof value !== 'string') return null;

  const number = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
  const pattern = new RegExp(`^\\s*x\\s*(${number})\\s*,\\s*y\\s*(${number})\\s*$`, 'i');
  const match = value.match(pattern);

  if (!match) return null;

  const x = Number(match[1]);
  const y = Number(match[2]);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

function calculateDistanceMeters(start, end) {
  return Math.round(Math.hypot(end.x - start.x, end.y - start.y) * 100);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseCoordinates, calculateDistanceMeters };
}

if (typeof document !== 'undefined') {
  const weaponInput = document.querySelector('#weapon-position');
  const targetInput = document.querySelector('#target-position');
  const weaponError = document.querySelector('#weapon-error');
  const targetError = document.querySelector('#target-error');
  const resultValue = document.querySelector('#range-value');
  const resultStatus = document.querySelector('#range-status');
  const resultPanel = document.querySelector('.result-panel');
  const clearButton = document.querySelector('#clear-button');
  const storageKey = 'wardogs-weapon-position';

  const showValidation = (input, error, hasValue, isValid) => {
    const isInvalid = hasValue && !isValid;
    input.setAttribute('aria-invalid', String(isInvalid));
    error.hidden = !isInvalid;
  };

  const updateRange = () => {
    const weaponValue = weaponInput.value;
    const targetValue = targetInput.value;
    const weapon = parseCoordinates(weaponValue);
    const target = parseCoordinates(targetValue);
    const hasWeapon = weaponValue.trim().length > 0;
    const hasTarget = targetValue.trim().length > 0;

    showValidation(weaponInput, weaponError, hasWeapon, Boolean(weapon));
    showValidation(targetInput, targetError, hasTarget, Boolean(target));

    if (weapon) {
      localStorage.setItem(storageKey, weaponValue.trim());
    } else if (!hasWeapon) {
      localStorage.removeItem(storageKey);
    }

    if (weapon && target) {
      resultValue.textContent = calculateDistanceMeters(weapon, target).toLocaleString();
      resultStatus.textContent = 'meters to target';
      resultPanel.dataset.state = 'ready';
      return;
    }

    resultValue.textContent = '—';
    resultStatus.textContent = (hasWeapon && !weapon) || (hasTarget && !target)
      ? 'Check highlighted coordinates'
      : 'Awaiting coordinates';
    resultPanel.dataset.state = 'waiting';
  };

  const selectForReplacement = (event) => {
    if (event.currentTarget.value) {
      const input = event.currentTarget;
      setTimeout(() => input.select(), 0);
    }
  };

  try {
    const savedWeapon = localStorage.getItem(storageKey);
    if (savedWeapon && parseCoordinates(savedWeapon)) weaponInput.value = savedWeapon;
  } catch (_) {
    // Storage can be unavailable in privacy-restricted contexts; calculation still works.
  }

  [weaponInput, targetInput].forEach((input) => {
    input.addEventListener('input', updateRange);
    input.addEventListener('focus', selectForReplacement);
    input.addEventListener('click', selectForReplacement);
  });

  clearButton.addEventListener('click', () => {
    weaponInput.value = '';
    targetInput.value = '';
    try {
      localStorage.removeItem(storageKey);
    } catch (_) {
      // The fields can still be reset even if storage is unavailable.
    }
    updateRange();
    weaponInput.focus();
  });

  updateRange();
}
