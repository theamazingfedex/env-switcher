/**
 * Environment Variable Switcher by Daniel Wood 2021
 *
 * usage:
 *  `node envSwitcher.js {pathToEnvFile} {targetEnv}`
 * examples:
 *  `node envSwitcher.js ./.env local`
 *  `node envSwitcher.js ./.env dev`
 *  `node envSwitcher.js ./.env QA`
 *  `node envSwitcher.js ./.env sTAgE`
 *  -
 * .env file format:
 *  Each environment needs to be formatted in a specific way in order for this tool to work correctly.
 *  `# #` - two pound signs with a space between them denotes a row which should be ignored by this script (no commenting/uncommenting).
 *  -
 *  `# # LOCAL BEGIN` - two pound signs with a space between them, followed by 'LOCAL BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 *  `# # LOCAL END` - two pound signs with a space between them, followed  by 'LOCAL END' in ALL CAPS denotes the end of the LOCAL env section.
 *  -
 *  `# # DEV BEGIN` - two pound signs with a space between them, followed by 'DEV BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 *  `# # DEV END` - two pound signs with a space between them, followed  by 'DEV END' in ALL CAPS denotes the end of the LOCAL env section.
 *  -
 *  `# # QA BEGIN` - two pound signs with a space between them, followed by 'QA BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 *  `# # QA END` - two pound signs with a space between them, followed  by 'QA END' in ALL CAPS denotes the end of the LOCAL env section.
 *  -
 *  `# # STAGE BEGIN` - two pound signs with a space between them, followed by 'STAGE BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 *  `# # STAGE END` - two pound signs with a space between them, followed  by 'STAGE END' in ALL CAPS denotes the end of the LOCAL env section.
 *  -
 *  `# # PROD BEGIN` - two pound signs with a space between them, followed by 'PROD BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 *  `# # PROD END` - two pound signs with a space between them, followed  by 'PROD END' in ALL CAPS denotes the end of the LOCAL env section.
 *  -
 *  -
 *  example .env file:
 *  `# # LOCAL BEGIN
 *  # # these are the local env vars (double up on comments, with a space between them and the line will remain unchanged)
 *  # DB_HOST=host.docker.internal # this line will become uncommented once `node envSwitcher.js ./.env local` is executed
 *  # # LOCAL END
 *
 *  # # DEV BEGIN
 *  # # FalconDB-DEV
 *  DB_HOST=aurora-pgsql.dev.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 *  # # DEV END
 *
 *  # # QA BEGIN
 *  # # FalconDB-QA
 *  DB_HOST=aurora-pgsql.qa.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 *  # # QA END
 *
 *  # # STAGE BEGIN
 *  # # FalconDB-STAGE
 *  DB_HOST=aurora-pgsql.stg.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 *  # # STAGE END
 *
 *  # # PROD BEGIN
 *  # # FalconDB-PROD
 *  DB_HOST=aurora-pgsql.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 *  # # PROD END
 *
 *  # Unchanging Env Vars: (anything outside of the ENV BEGIN/END blocks will not be touched by this script execution)
 *  DMS_DB_DATABASE=DMS
 *  DMS_DB_PORT=3306
 *  DMS_DB_SCHEMA=DMS
 *  ...
 * `
 */
const fs = require('fs');

const [envFilePath, targetEnv] = process.argv.slice(2);

const envFile = fs.readFileSync(envFilePath, 'utf-8');
const textByLine = envFile.split('\n');
const lineNumberMap = {
  local: {
    begin: 0,
    end: 0,
  },
  dev: {
    begin: 0,
    end: 0,
  },
  qa: {
    begin: 0,
    end: 0,
  },
  stage: {
    begin: 0,
    end: 0,
  },
  prod: {
    begin: 0,
    end: 0,
  },
};

textByLine.forEach((line, idx) => {
  if (line.includes('LOCAL BEGIN')) {
    lineNumberMap.local.begin = idx;
  }
  if (line.includes('LOCAL END')) {
    lineNumberMap.local.end = idx;
  }
  if (line.includes('DEV BEGIN')) {
    lineNumberMap.dev.begin = idx;
  }
  if (line.includes('DEV END')) {
    lineNumberMap.dev.end = idx;
  }
  if (line.includes('QA BEGIN')) {
    lineNumberMap.qa.begin = idx;
  }
  if (line.includes('QA END')) {
    lineNumberMap.qa.end = idx;
  }
  if (line.includes('STAGE BEGIN')) {
    lineNumberMap.stage.begin = idx;
  }
  if (line.includes('STAGE END')) {
    lineNumberMap.stage.end = idx;
  }
  if (line.includes('PROD BEGIN')) {
    lineNumberMap.prod.begin = idx;
  }
  if (line.includes('PROD END')) {
    lineNumberMap.prod.end = idx;
  }
});

console.log('lineNumberMap: ', lineNumberMap);

const disableSection = (arr, beginIdx, endIdx) => {
  return arr.map((line, idx) => {
    if (idx > beginIdx && idx < endIdx && !line.startsWith('#') && !line.startsWith('# #')) {
      return `# ${line}`;
    }
    return line;
  });
};

const enableSection = (arr, beginIdx, endIdx) => {
  return arr.map((line, idx) => {
    if (idx > beginIdx && idx < endIdx && line.startsWith('#') && !line.startsWith('# #')) {
      return line.substr(2);
    }
    return line;
  });
};

let outputLines = [];

if (targetEnv.toLowerCase() === 'local') {
  console.log('ENABLING LOCAL ENVIRONMENT VARIABLES...');
  outputLines = enableSection(textByLine, lineNumberMap.local.begin, lineNumberMap.local.end);
  outputLines = disableSection(outputLines, lineNumberMap.dev.begin, lineNumberMap.dev.end);
  outputLines = disableSection(outputLines, lineNumberMap.qa.begin, lineNumberMap.qa.end);
  outputLines = disableSection(outputLines, lineNumberMap.stage.begin, lineNumberMap.stage.end);
  outputLines = disableSection(outputLines, lineNumberMap.prod.begin, lineNumberMap.prod.end);
  console.log('ENABLING LOCAL ENVIRONMENT VARIABLES COMPLETE');
}
if (targetEnv.toLowerCase() === 'dev') {
  console.log('ENABLING DEV ENVIRONMENT VARIABLES...');
  outputLines = enableSection(textByLine, lineNumberMap.dev.begin, lineNumberMap.dev.end);
  outputLines = disableSection(outputLines, lineNumberMap.local.begin, lineNumberMap.local.end);
  outputLines = disableSection(outputLines, lineNumberMap.qa.begin, lineNumberMap.qa.end);
  outputLines = disableSection(outputLines, lineNumberMap.stage.begin, lineNumberMap.stage.end);
  outputLines = disableSection(outputLines, lineNumberMap.prod.begin, lineNumberMap.prod.end);
  console.log('ENABLING DEV ENVIRONMENT VARIABLES COMPLETE');
}
if (targetEnv.toLowerCase() === 'qa') {
  console.log('ENABLING QA ENVIRONMENT VARIABLES...');
  outputLines = enableSection(textByLine, lineNumberMap.qa.begin, lineNumberMap.qa.end);
  outputLines = disableSection(outputLines, lineNumberMap.local.begin, lineNumberMap.local.end);
  outputLines = disableSection(outputLines, lineNumberMap.dev.begin, lineNumberMap.dev.end);
  outputLines = disableSection(outputLines, lineNumberMap.stage.begin, lineNumberMap.stage.end);
  outputLines = disableSection(outputLines, lineNumberMap.prod.begin, lineNumberMap.prod.end);
  console.log('ENABLING QA ENVIRONMENT VARIABLES COMPLETE');
}
if (targetEnv.toLowerCase() === 'stage') {
  console.log('ENABLING STAGE ENVIRONMENT VARIABLES...');
  outputLines = enableSection(textByLine, lineNumberMap.stage.begin, lineNumberMap.stage.end);
  outputLines = disableSection(outputLines, lineNumberMap.local.begin, lineNumberMap.local.end);
  outputLines = disableSection(outputLines, lineNumberMap.dev.begin, lineNumberMap.dev.end);
  outputLines = disableSection(outputLines, lineNumberMap.qa.begin, lineNumberMap.qa.end);
  outputLines = disableSection(outputLines, lineNumberMap.prod.begin, lineNumberMap.prod.end);
  console.log('ENABLING STAGE ENVIRONMENT VARIABLES COMPLETE');
}
if (targetEnv.toLowerCase() === 'prod') {
  console.log('ENABLING PROD ENVIRONMENT VARIABLES...');
  outputLines = enableSection(textByLine, lineNumberMap.prod.begin, lineNumberMap.prod.end);
  outputLines = disableSection(outputLines, lineNumberMap.local.begin, lineNumberMap.local.end);
  outputLines = disableSection(outputLines, lineNumberMap.dev.begin, lineNumberMap.dev.end);
  outputLines = disableSection(outputLines, lineNumberMap.qa.begin, lineNumberMap.qa.end);
  outputLines = disableSection(outputLines, lineNumberMap.stage.begin, lineNumberMap.stage.end);
  console.log('ENABLING PROD ENVIRONMENT VARIABLES COMPLETE');
}

try {
  fs.writeFileSync(envFilePath, outputLines.join('\n'));
  console.log(`Env file '${envFilePath}' successfully updated to use ${targetEnv.toUpperCase()} environment variables.`);
} catch (e) {
  console.error(`Writing to '${envFilePath}' failed. :: ${e}`);
}
