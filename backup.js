/**
 * This application creates a tarball archive of public data in a
 * Google Cloud S3 bucket.
 */

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const bucketName = 'nimactive';

const bucket = storage.bucket(bucketName);

async function backupS3Bucket(bucket) {
    bucket
	.getFiles()
	.then(result => console.log('Results:', result[0]))
	.catch(error => console.log('ERROR:', error));
}

backupS3Bucket(bucket);
