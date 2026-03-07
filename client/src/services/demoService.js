import demoDB from './demoDB';

/* ========================================
   DEMO SERVICE
   Enables frontend to run independently
======================================== */

// Check if running in demo mode (for deployment)
export const isDemo = () => {
  // For deployment demo, always run frontend in standalone mode.
  return true;
};

// Export demo database
export { demoDB };

export default {
  isDemo,
  demoDB
};
