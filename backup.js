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
    const files = await getFilesInBucket(bucket);
    console.log('One file name', files[0].name);
}

async function getFilesInBucket(bucket) {
    return bucket
	.getFiles()
        .then(result => result[0])
	.catch(error => {
	    console.log('ERROR: Failed to list files in bucket');
	    console.log(error);
	    process.exit(1);
	});
}


backupS3Bucket(bucket);

