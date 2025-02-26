require('dotenv').config();
let fs = require('fs');
let path = require('path');
const child_process = require('child_process');
let options = { stdio: 'inherit' };

if (!fs.existsSync(path.join(__dirname, '../dist/index.js'))) {
  console.log('building plugin...');
  child_process.execSync(
    `yarn --cwd ${path.join(__dirname, '../')} install`,
    options,
  );
  child_process.execSync(
    `yarn --cwd ${path.join(__dirname, '../')} build`,
    options,
  );
}

let files = findAllPackageDotJson(__dirname);

console.log(`found ${files.length} examples`);

// if you want to run a single example, then you can specify its name here:
let target = '';

for (let i = 0; i < files.length; i++) {
  let example = files[i];
  if (target.length && !example.endsWith(target)) continue;

  console.log(`=====================================`);
  console.log(`= Running e2e test example ${example}`);
  console.log(`=====================================`);
  child_process.execSync(`yarn --cwd ${example} install`, options);
  child_process.execSync(`yarn --cwd ${example} test`, options);
  console.log('\r\n');
}

function findAllPackageDotJson(folder) {
  // console.log(`scanning ${folder}`);

  let wanted = [];
  let files = fs.readdirSync(folder);
  let ignore = ['node_modules', '.s'];
  for (let i = 0; i < files.length; i++) {
    let filename = files[i];
    if (ignore.includes(filename)) continue;

    let filepath = path.join(folder, filename);
    if (filename === 'package.json') {
      wanted.push(folder);
      continue;
    }

    if (fs.statSync(filepath).isDirectory()) {
      wanted = wanted.concat(findAllPackageDotJson(filepath));
    }
  }
  return wanted;
}
