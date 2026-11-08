/**
 * The threshold in degrees that the user must scroll before the knob
 * registers a change in value.
 */
export const ANGLE_OFFSET_THRESHOLD = 10;

/**
 * Touch inputs use a slightly higher threshold to prevent accidental drift.
 */
export const TOUCH_ANGLE_OFFSET_THRESHOLD = 14;

/**
 * The threshold in pixels that the user must pan before we consider the input a pan.
 */
export const PAN_THRESHOLD = 5;

/**
 * Touch inputs need a more forgiving threshold since fingers naturally drift
 * more than a mouse cursor, causing accidental button presses during scrolling.
 */
export const TOUCH_PAN_THRESHOLD = 12;

/**
 * If no scroll tick fires within this window, velocity resets to zero.
 * Matches Rockbox's WHEEL_FAST_OFF_TIMEOUT (250ms).
 */
export const VELOCITY_TIMEOUT_MS = 250;

/**
 * Velocity-to-skip mapping thresholds (velocity units: ticks/second).
 * Controlled skip avoids skipping the entire list in short menus.
 */
export const VELOCITY_SKIP_THRESHOLDS = [
  { minVelocity: 0, skip: 1 },
  { minVelocity: 10, skip: 2 },
  { minVelocity: 18, skip: 3 },
];