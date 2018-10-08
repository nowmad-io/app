import Firebase from './firebase';

const { polyfill, fs } = require('rn-fetch-blob').default;

export default (uri, mime = 'application/octet-stream') => new Promise((resolve, reject) => {
  const name = uri.split('/').pop();
  const imageRef = Firebase.storage().ref(name);

  let uploadBlob = null;

  fs.readFile(uri, 'base64')
    .then(data => polyfill.Blob.build(data, { type: `${mime};BASE64` }))
    .then((blob) => {
      uploadBlob = blob;
      return imageRef.put(blob, {
        contentType: mime,
        gzip: true,
        public: true,
      });
    })
    .then(() => {
      uploadBlob.close();
      return imageRef.getDownloadURL();
    })
    .then(resolve)
    .catch(reject);
});
