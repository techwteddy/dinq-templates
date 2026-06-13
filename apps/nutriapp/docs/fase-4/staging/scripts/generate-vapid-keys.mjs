/**
 * scripts/generate-vapid-keys.mjs
 *
 * Run once to generate VAPID keys for Web Push:
 *   node scripts/generate-vapid-keys.mjs
 *
 * Copy the output to your .env.local (never commit these!)
 */
import webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

console.log("Add these to your .env.local:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY="${publicKey}"`);
console.log(`VAPID_PRIVATE_KEY="${privateKey}"`);
console.log(`VAPID_SUBJECT="mailto:you@example.com"`);
