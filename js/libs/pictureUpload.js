import firebase from 'firebase';

const { polyfill, fs } = require('rn-fetch-blob').default;

class PictureUpload {
  firebase;

  initialize(config) {
    this.firebase = firebase.initializeApp(config);
  }

  upload = (uri, success, error, mime = 'application/octet-stream') => new Promise(() => {
    const name = uri.split('/').pop();
    const imageRef = this.firebase.storage().ref(name);

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
      .then(success)
      .catch(error);
  })
}

export default new PictureUpload();
