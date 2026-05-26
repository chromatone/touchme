import { registerAnimationCallback } from './midi'

/**
 * Reusable spring physics composable
 * @param {Object} options - Configuration options
 * @param {number} options.tension - Spring tension (default: 0.08)
 * @param {number} options.friction - Spring friction (default: 0.82)
 * @param {number} options.settleThreshold - Distance threshold for settling (default: 0.1)
 * @param {number} options.velocityThreshold - Velocity threshold for settling (default: 0.01)
 * @returns {Object} Spring physics utilities
 */
export function useSpring(options = {}) {
  const {
    tension = 0.08,
    friction = 0.82,
    settleThreshold = 0.1,
    velocityThreshold = 0.01
  } = options

  let lastTime = 0

  /**
   * Create a spring-animated value
   * @param {number} initialValue - Initial value
   * @param {Object} config - Per-value configuration
   * @returns {Object} Spring state with value, velocity, and update method
   */
  function createSpringValue(initialValue = 0, config = {}) {
    return {
      value: initialValue,
      velocity: 0,
      target: initialValue,
      ...config
    }
  }

  /**
   * Update spring physics for a value
   * @param {Object} springState - Spring state object
   * @param {number} targetValue - Target value to spring toward
   * @param {number} deltaTime - Time delta in seconds
   * @returns {boolean} True if value is settled
   */
  function updateSpring(springState, targetValue, deltaTime) {
    const delta = targetValue - springState.value

    // Check if settled
    if (Math.abs(delta) < settleThreshold && Math.abs(springState.velocity) < velocityThreshold) {
      springState.value = targetValue
      springState.velocity = 0
      return true
    }

    // Apply spring physics
    const acceleration = delta * tension
    springState.velocity = (springState.velocity + acceleration) * friction
    springState.value += springState.velocity * deltaTime * 60

    return false
  }

  /**
   * Register spring animation callback
   * @param {Function} updateFn - Function to call each frame with deltaTime
   * @returns {Function} Unregister function
   */
  function registerSpring(updateFn) {
    return registerAnimationCallback((time) => {
      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0.016
      lastTime = time
      updateFn(deltaTime)
    })
  }

  /**
   * Create a 2D spring (for x, y coordinates)
   * @param {Object} initial - Initial {x, y} values
   * @returns {Object} Spring state with x, y, vx, vy
   */
  function createSpring2D(initial = { x: 0, y: 0 }) {
    return {
      x: initial.x,
      y: initial.y,
      vx: 0,
      vy: 0
    }
  }

  /**
   * Update 2D spring physics
   * @param {Object} springState - Spring state with x, y, vx, vy
   * @param {Object} target - Target {x, y} values
   * @param {number} deltaTime - Time delta in seconds
   * @returns {boolean} True if settled
   */
  function updateSpring2D(springState, target, deltaTime) {
    const dx = target.x - springState.x
    const dy = target.y - springState.y

    // Check if settled
    if (Math.abs(dx) < settleThreshold && Math.abs(dy) < settleThreshold &&
        Math.abs(springState.vx) < velocityThreshold && Math.abs(springState.vy) < velocityThreshold) {
      springState.x = target.x
      springState.y = target.y
      springState.vx = 0
      springState.vy = 0
      return true
    }

    // Apply spring physics
    const ax = dx * tension
    const ay = dy * tension
    springState.vx = (springState.vx + ax) * friction
    springState.vy = (springState.vy + ay) * friction
    springState.x += springState.vx * deltaTime * 60
    springState.y += springState.vy * deltaTime * 60

    return false
  }

  return {
    createSpringValue,
    updateSpring,
    registerSpring,
    createSpring2D,
    updateSpring2D,
    tension,
    friction,
    settleThreshold,
    velocityThreshold
  }
}
