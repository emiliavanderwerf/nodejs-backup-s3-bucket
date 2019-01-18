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
    console.log('Backup file name', getBackupName());
}

async function getFilesInBucket(bucket) {
    return bucket
	.getFiles()
        .then(result => result[0])
	.catch(error => {
	    console.error('ERROR: Failed to list files in bucket');
	    console.error(error);
	    process.exit(1);
	});
}


function getBackupName() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = leftPadByTwo(currentTime.getMonth() + 1);
    const date = leftPadByTwo(currentTime.getDate());
    const hour = leftPadByTwo(currentTime.getHours());
    const minute = leftPadByTwo(currentTime.getMinutes());
    
    return `backup-${year}-${month}-${date}-${hour}-${minute}`
}

function leftPadByTwo(dateElement) {
    return dateElement.toString().padStart(2, '0');
}

backupS3Bucket(bucket);

