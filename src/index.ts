import fs from 'node:fs';
import process from 'node:process';
import {main} from './main.js';

const stdinJson = fs.readFileSync(0, 'utf8');
const [_, __, ...input] = process.argv;

const result = main(input, stdinJson);

console.log(result);
