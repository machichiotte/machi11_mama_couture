
import { generateImage } from './src/lib/ai/gemini';
import { logger } from './src/lib/utils/logger';

async function test() {
  console.log('Test image gen...');
  try {
    const buffer = await generateImage('A cute cat');
    console.log('Success!', buffer.length);
  } catch (e) {
    console.error('Failed', e);
  }
}

test();

