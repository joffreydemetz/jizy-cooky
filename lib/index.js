import Cooky from './Core.js';

// Set the default cookie name
Cooky.setCookieName('jizy_cooky');

// Preload Cooky elements and bind events
Cooky.preload();

// Expose Cooky globally for use on websites
window.Cooky = Cooky;

// Export Cooky for external use
export default Cooky;
