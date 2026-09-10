/** Host-face typert artifact (package export `./typert`).
 *  The typert-loader imports this module for every mounted loader entry
 *  whose package exports the key, validates the manifest, and registers
 *  it with the gateway — out-of-tree plugins participate automatically.
 */
export { TYPERT } from "./wire.js";
