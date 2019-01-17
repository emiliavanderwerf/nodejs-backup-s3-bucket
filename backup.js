/**
 * This application creates a tarball archive of public data in a
 * Google Cloud S3 bucket.
 */

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();


async function listFilesInBucket(bucketName) {

  // Lists files in the bucket
  await storage.bucket(bucketName).getFiles(function(err, files) {
    if (!err) {
      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    } else {
      console.log('Error', err);
    }
  });

}


const bucketName = 'nimactive';

listFilesInBucket(bucketName).then(result => {
  // ...
}).catch(error => {
  // if you have an error
})















/*const bucketName = 'nimactive';
const srcFilename = 'https://console.cloud.google.com/storage/browser/nimactive/animals/CatAnd3Dogs.jpeg';
const destFilename = 'C:/Temp/CatAnd3Dogs.jpeg';

// Downloads the file
await storage
  .bucket(bucketName)
  .file(srcFilename)
  .download(options);

const options = {
  destination: destFilename,
};

console.log(
  `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
);

*/