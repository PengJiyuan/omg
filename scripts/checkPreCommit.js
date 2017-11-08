/**
 * Author: PengJiyuan
 *
 * Check if pre-commit hook exist
 * if not exist, create pre-commit
 * before commit, npm run eslint
 */

const path = require('path');
const fs = require('fs');
const execFile = require('child_process').execFile;
const scriptPath = path.resolve(__dirname, 'pre-commit.sh');
require('colors');

if(fs.existsSync(path.resolve(__dirname, '../.git/hooks/pre-commit'))) {
  console.log('Pre Commit Hook already exist!'.green);
} else {
  fs.chmod(scriptPath, '755', () => {
    console.log('chmod 755 pre-commit.sh.'.green);
    execFile(scriptPath, [path.join(__dirname, '..')], {
      cwd: path.join(__dirname, '..')
    }, () => {
      console.log('Add Pre Commit Hook Success!'.green);
      console.log('');
    });
  });
}
