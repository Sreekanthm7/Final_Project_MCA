/**
 * Auto-detects the machine's current local network IP and updates .env
 * so React Native can always reach the backend regardless of network changes.
 *
 * Run automatically before `expo start` via package.json scripts.
 */

const os = require("os");
const fs = require("fs");
const path = require("path");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

const ip = getLocalIP();

if (!ip) {
  console.warn(
    "⚠️  Could not detect local IP. Make sure you are connected to a network."
  );
  console.warn("   Using existing .env value unchanged.");
  process.exit(0);
}

const envPath = path.join(__dirname, "..", ".env");
let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

const newApiUrl = `http://${ip}:5000/api`;
const linePattern = /^EXPO_PUBLIC_API_URL=.*$/m;

if (linePattern.test(envContent)) {
  const oldLine = envContent.match(linePattern)[0];
  if (oldLine === `EXPO_PUBLIC_API_URL=${newApiUrl}`) {
    console.log(`✅  API URL already correct: ${newApiUrl}`);
    process.exit(0);
  }
  envContent = envContent.replace(linePattern, `EXPO_PUBLIC_API_URL=${newApiUrl}`);
} else {
  envContent = `EXPO_PUBLIC_API_URL=${newApiUrl}\n` + envContent;
}

fs.writeFileSync(envPath, envContent, "utf8");
console.log(`✅  API URL auto-updated to: ${newApiUrl}`);
console.log(`   (IP changed — restarting Expo with --clear is recommended)`);
