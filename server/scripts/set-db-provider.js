const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const isForceProd = process.argv.includes('--force-prod');
const provider = (isForceProd || process.env.NODE_ENV === 'production') ? 'postgresql' : 'sqlite';

const currentProviderMatch = schema.match(/provider\s*=\s*"([^"]+)"/);
const currentProvider = currentProviderMatch ? currentProviderMatch[1] : null;

if (currentProvider !== provider) {
    schema = schema.replace(/provider\s*=\s*"[^"]+"/, `provider = "${provider}"`);
    fs.writeFileSync(schemaPath, schema);
    console.log(`[Database Setup] Prisma provider updated to: ${provider}`);
} else {
    console.log(`[Database Setup] Prisma provider is already: ${provider}`);
}
