/**
 * This application creates a tarball archive of public data in a
 * Google Cloud S3 bucket.
 */

// Imports
const fs = require('fs');
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const bucketName = 'nimactive';


/*
 * Top-level function which creates a tarball backup of a S3 bucket.
 *
 * @param {Bucket} Google Cloud bucket
 */
async function backupS3Bucket(bucketName) {
    const bucket = storage.bucket(bucketName);
    const files = await getFilesInBucket(bucket);
    
    prepareBackupDir(bucketName);

}

/*
 * List all accessible files in bucket. Will not list private files.
 *
 * @param {Bucket} Google Cloud bucket
 * @returns {Array of File} List of files in bucket, on success
 */
async function getFilesInBucket(bucket) {
    return bucket
	.getFiles()
        // GetFilesResponse object's parameter 0 is array of File
        .then(result => result[0])
	.catch(error => {
	    console.error('ERROR: Failed to list files in bucket');
	    console.error(error);
	    process.exit(1);
	});
}

function prepareBackupDir(bucketName) {
    const backupDirName = getBackupName();
    const fullPath = `/tmp/${backupDirName}/${bucketName}`;

    // Synchronously create backup directory
    fs.mkdirSync(fullPath, { recursive: true }, (error) => {
	if (error) {
	    console.error('ERROR: Failed to create directory', fullPath);
	    console.error(error);
	    process.exit(1);
	}
    });

    
}

/*
 * Get name of the backup file in format `backup-<date>`, where
 * <date> is `yyyy-mm-dd-hh-MM`.
 *
 * @returns {string} Backup file name
 */
function getBackupName() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = leftPadByTwo(currentTime.getMonth() + 1);
    const date = leftPadByTwo(currentTime.getDate());
    const hour = leftPadByTwo(currentTime.getHours());
    const minute = leftPadByTwo(currentTime.getMinutes());
    
    return `backup-${year}-${month}-${date}-${hour}-${minute}`
}

/*
 * Left pad a date element by zero for a target length of two
 *
 * @param {number} The date element (ie. month, hour, etc.)
 * @returns {string} Padded date element
 */
function leftPadByTwo(dateElement) {
    return dateElement.toString().padStart(2, '0');
}

backupS3Bucket(bucketName);

