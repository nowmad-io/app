/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const reactNativeMaps = path.join(root, './node_modules/react-native-maps/lib/android/build.gradle');

fs.readFile(reactNativeMaps, 'utf8', (err, contents) => {
  let newContents = contents.replace(/compileOnly/g, 'provided');
  newContents = newContents.replace(/implementation/g, 'compile');

  fs.writeFileSync(reactNativeMaps, newContents);
});
