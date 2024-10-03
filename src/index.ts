import { syncConfigsAgent } from './sync-configs/sync-configs';

const organizations = ['ubiquity-os', 'ubiquity-os-marketplace', 'ubiquity'];

async function main() {
  const inputString = process.argv[2] || process.env.INPUT_STRING || '';
  console.log('Input string:', inputString);

  try {
    await syncConfigsAgent(organizations);
    console.log('Sync completed successfully');
  } catch (error) {
    console.error('Error during sync:', error);
  }
}

main().catch(console.error);
