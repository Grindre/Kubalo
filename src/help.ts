import chalk from 'chalk';

const usage = `
npm run <command> included in ${ chalk.bold( process.env.npm_package_name ) }:

Usage:

npm run ${ chalk.bold( 'help' ) }\t\t\t\t\t\t- this usage page
npm run ${ chalk.bold( 'clean' ) }\t- clean up all dist files and its own directory
npm run ${ chalk.bold( 'build