/*!
 * @Author: PengJiyuan
 * Github release and npm publish
 */
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const PKG_PATH = path.join(__dirname, '../package.json');

const pkg = require('../package.json');
const pkgFile = fs.readFileSync(PKG_PATH, 'utf-8');

const args = process.argv.slice(2);

const currentVersion = pkg.version;
const version = args[0] || pkg.version;
const commitMsg = args[1] || 'Release version: v' + version;
require('colors');

function changeVersion(v) {
  const newPkgFile = pkgFile.replace(
    /^(\s+"version": ").*?"/m, '$1' + v + '"'
  );
  fs.writeFileSync(PKG_PATH, newPkgFile);
}

/*
 * Change version in package.json
 */
changeVersion(version);

console.log('package.json updated Success!'.green);

/*
 * Build & Commit & Add Tag & push tag origin & push origin & publish to NPM
 */

console.log('\nBuild...\n');

child_process.exec('npm run build', (err, stdout) => {
  if(err) {
    changeVersion(currentVersion);
    console.log('Build failed!'.red);
    console.error(err);
    process.exit(0);
  }
  console.log(stdout.grey);

  console.log('\nStart Git Commit...\n');

  child_process.exec(`git add . && git commit -m "${commitMsg}"`, (err, stdout) => {
    if(err) {
      changeVersion(currentVersion);
      console.log('Commit failed!'.red);
      console.error(err);
      process.exit(0);
    }

    console.log(stdout.green);
    console.log('\nCommit Success!\n'.green);

    console.log('\nAdd Tag...\n');

    child_process.exec('git tag v' + version, function(err, stdout) {
      if(err) {
        changeVersion(currentVersion);
        console.log('Add Tag Failed!'.red);
        console.error(err);
        process.exit(0);
      }

      console.log(stdout);
      console.log(('Add Tag v' + version + ' Success!\n').green);

      console.log('\nStart Push Origin Tag...\n');
      child_process.exec('git push origin v' + version, function(err, stdout) {
        if(err) {
          console.log('Push Origin Tag Failed!'.red);
          console.error(err);
          process.exit(0);
        }

        console.log(stdout);
        console.log('Push Origin Tag Success!\n'.green);

        console.log('Start Push Origin...\n');
        child_process.exec('git push origin master', function(err, stdout) {
          if(err) {
            console.log('Push Origin Failed!');
            console.error(err);
            process.exit(0);
          }

          console.log(stdout);
          console.log('Push Origin Success!\n'.green);

          console.log('Start Publish to NPM!');
          child_process.exec('npm publish', function(err, stdout) {
            if(err) {
              console.log('NPM Publish Failed! Try again -- "npm publish"!'.red);
              console.error(err);
            } else {
              console.log(stdout);
              console.log('NPM Publish Success!\n'.green);
              console.log('################ All Done! ################'.green);
            }
          });
        });
      });

    });
  });
});
