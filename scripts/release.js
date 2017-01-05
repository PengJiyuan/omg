var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var PKG_PATH = path.join(__dirname, '../package.json');

var pkg = require('../package.json');
var pkgFile = fs.readFileSync(PKG_PATH, 'utf-8');

var args = process.argv.slice(2);

var currentVersion = pkg.version;
var version = args[0];

function changeVersion(v) {
  var newPkgFile = pkgFile.replace(
    /^(\s+"version": ").*?"/m, '$1' + v + '"'
  );
  fs.writeFileSync(PKG_PATH, newPkgFile);
}

if(!version || !/^(\d+\.){2}\d+$/.test(version)) {
  console.log('please specify a version!');
  process.exit(0);
} else if(version <= currentVersion) {
  console.log('The version you specified must bigger than current version!');
  process.exit(0);
}

/*
 * Change version in package.json
 */

console.log('Updating package.json version...');
console.log('');
changeVersion(version);

console.log('package.json updated Success!');

/*
 * Build & Commit & Add Tag & push tag origin & push origin & publish to NPM
 */

console.log('');
console.log('Build...');

child_process.exec('npm run build', function(err, stdout) {
  if(err) {
    changeVersion(currentVersion);
    console.log('Build failed!');
    console.error(err);
    process.exit(0);
  }
  console.log(stdout);

  console.log('Git Commit..');
  console.log('');

  child_process.exec('git add . && git commit -m "' + version + '"', function(err, stdout) {
    if(err) {
      changeVersion(currentVersion);
      console.log('Commit failed!');
      console.error(err);
      process.exit(0);
    }

    console.log(stdout);
    console.log('');
    console.log('Commit Success!');
    console.log('');

    console.log('Add Tag...');

    child_process.exec('git tag v' + version, function(err, stdout) {
      if(err) {
        changeVersion(currentVersion);
        console.log('Add Tag Failed!');
        console.error(err);
        process.exit(0);
      }

      console.log(stdout);
      console.log('Add Tag v' + version + ' Success!');
      console.log('');

      console.log('Push Origin Tag...');
      child_process.exec('git push origin v' + version, function(err, stdout) {
        if(err) {
          changeVersion(currentVersion);
          console.log('Push Origin Tag Failed!');
          console.error(err);
          process.exit(0);
        }

        console.log(stdout);
        console.log('Push Origin Tag Success!');
        console.log('');

        console.log('Push Origin...');
        child_process.exec('git push origin master', function(err, stdout) {
          if(err) {
            changeVersion(currentVersion);
            console.log('Push Origin Failed!');
            console.error(err);
            process.exit(0);
          }

          console.log(stdout);
          console.log('Push Origin Success!');
          console.log('');

          console.log('Publish to NPM!');
          child_process.exec('npm publish', function(err, stdout) {
            if(err) {
              console.log('NPM Publish Failed! Try again -- "npm publish"!');
              console.error(err);
            }
            console.log(stdout);
            console.log('NPM Publish Success!');
            console.log('');
            console.log('################ All Done! ################');
          });
        });
      });

    });
  });
});
