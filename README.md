
# Environment Variable Switcher by Daniel Wood 2021

## Usage:
`node envSwitcher.js {pathToEnvFile} {targetEnv}`

For v1(current) you will need to copy `envSwitcher.js` into your graphql-repository's `root/scripts` folder then for convenience, add script entries to the graphql-repository's `package.json`

### Examples:
 ```
 node envSwitcher.js ./.env local
 node envSwitcher.js ./.env dev
 node envSwitcher.js ./.env QA
 node envSwitcher.js ./.env sTAgE
 ```

#### Scripts for `package.json`:
 ```
 "env:local": "node ./scripts/envSwitcher.js ./.env local",
 "env:dev": "node ./scripts/envSwitcher.js ./.env dev",
 "env:qa": "node ./scripts/envSwitcher.js ./.env qa",
 "env:stage": "node ./scripts/envSwitcher.js ./.env stage",
 "env:prod": "node ./scripts/envSwitcher.js ./.env prod",
 ```

# 

## .env file format:
#### _Each environment in your .env file needs to be formatted in a specific way in order for this tool to work correctly._

 `# #` - two pound signs with a space between them denotes a row which should be ignored by this script (no commenting/uncommenting).

 `# # LOCAL BEGIN` - two pound signs with a space between them, followed by 'LOCAL BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 `# # LOCAL END` - two pound signs with a space between them, followed  by 'LOCAL END' in ALL CAPS denotes the end of the LOCAL env section.

 `# # DEV BEGIN` - two pound signs with a space between them, followed by 'DEV BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 `# # DEV END` - two pound signs with a space between them, followed  by 'DEV END' in ALL CAPS denotes the end of the LOCAL env section.

 `# # QA BEGIN` - two pound signs with a space between them, followed by 'QA BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 `# # QA END` - two pound signs with a space between them, followed  by 'QA END' in ALL CAPS denotes the end of the LOCAL env section.

 `# # STAGE BEGIN` - two pound signs with a space between them, followed by 'STAGE BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 `# # STAGE END` - two pound signs with a space between them, followed  by 'STAGE END' in ALL CAPS denotes the end of the LOCAL env section.

 `# # PROD BEGIN` - two pound signs with a space between them, followed by 'PROD BEGIN' in ALL CAPS denotes the beginning of the LOCAL env section.
 `# # PROD END` - two pound signs with a space between them, followed  by 'PROD END' in ALL CAPS denotes the end of the LOCAL env section.
 
# 

## Example `.env` file:
# 
````
 # # LOCAL BEGIN
 # # these are the local env vars (double up on comments, with a space between them and the line will remain unchanged)
 # DB_HOST=host.docker.internal # this line will become uncommented once `node envSwitcher.js ./.env local` is executed
 # # LOCAL END

 # # DEV BEGIN
 # # FalconDB-DEV
 DB_HOST=aurora-pgsql.dev.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 # # DEV END

 # # QA BEGIN
 # # FalconDB-QA
 DB_HOST=aurora-pgsql.qa.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 # # QA END

 # # STAGE BEGIN
 # # FalconDB-STAGE
 DB_HOST=aurora-pgsql.stg.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 # # STAGE END

 # # PROD BEGIN
 # # FalconDB-PROD
 DB_HOST=aurora-pgsql.evgo.com # this line will become commented-out when this script is executed for any environment besides DEV
 # # PROD END

 # Unchanging Env Vars: (anything outside of the ENV BEGIN/END blocks will not be touched by this script execution)
 DMS_DB_DATABASE=DMS
 DMS_DB_PORT=3306
 DMS_DB_SCHEMA=DMS
 ...
````

