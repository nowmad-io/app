/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
/* eslint-disable-next-line import/no-extraneous-dependencies */
const readJson = require('read-json');
const { exec } = require('child_process');

const root = path.resolve(__dirname, '..');
const packageJson = path.join(root, './package.json');
const packageLockJson = path.join(root, './package-lock.json');
const androidManifest = path.join(root, './android/app/src/main/AndroidManifest.xml');
const buildGradle = path.join(root, './android/app/build.gradle');
const loginComponent = path.join(root, './js/components/pages/auth/index.js');
/* eslint-disable-next-line import/no-extraneous-dependencies */
const simpleGit = require('simple-git')(root);

// commit
function commit(newVer) {
  simpleGit.add('.')
    .commit(`Bump version to ${newVer}`)
    .checkout('master', () => {
      exec('git merge develop');
    });
}

// Bump version
function bumpVersion() {
  readJson(packageJson, (_, data) => {
    const currentVersion = data.version;
    let newVersion = currentVersion.split('.');
    newVersion[newVersion.length - 1] = +newVersion[newVersion.length - 1] + 1;
    newVersion = newVersion.join('.');

    // Update package.json
    fs.writeFileSync(packageJson, JSON.stringify({
      ...data,
      version: newVersion,
    }, null, 2));

    // Update package-lock.json
    readJson(packageLockJson, (__, data2) => {
      fs.writeFileSync(packageLockJson, JSON.stringify({
        ...data2,
        version: newVersion,
      }, null, 2));

      // Update android/app/src/main/AndroidManifest.xml
      fs.readFile(androidManifest, 'utf8', (___, contents) => {
        const newContents = contents.replace(/(android:versionName=")(.*)(")/g, `$1${newVersion}$3`)
          .replace(/(android:versionCode=")(.*)(")/g, (match, p1, p2, p3) => (
            p1 + (+p2 + 1) + p3
          ));

        fs.writeFileSync(androidManifest, newContents);

        // Update android/app/build.gradle
        fs.readFile(buildGradle, 'utf8', (____, contents2) => {
          const newContents2 = contents2.replace(/(versionName ")(.*)(")/g, `$1${newVersion}$3`)
            .replace(/(versionCode )(.*)/g, (match, p1, p2) => (
              p1 + (+p2 + 1)
            ));

          fs.writeFileSync(buildGradle, newContents2);

          commit(newVersion);
        });
      });
    });
  });
}

simpleGit.diffSummary((err, results) => {
  if (results.insertions || results.deletions) {
    console.log('There are uncommited changed. Commit all changes before bumping version');
    return;
  }

  const loginFile = fs.readFileSync(loginComponent, 'utf8');
  if (loginFile.search('@') !== -1) {
    console.log('Remove dev credentials before bumping version !');
    return;
  }

  bumpVersion();
});
