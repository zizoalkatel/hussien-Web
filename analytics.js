/**
 * Vercel Web Analytics initialization for static HTML site
 * This script initializes Vercel Analytics tracking
 */

// Import and inject Vercel Analytics from the local module
import { inject } from './vercel-analytics.mjs';

// Initialize analytics - will only track in production on Vercel
inject();
