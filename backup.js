/**
 * This application creates a tarball archive of public data in a
 * Google Cloud S3 bucket.
 */

// Imports
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();


/*
 * Top-level function which creates a tarball backup of data accessible
 * within a Google Cloud S3 bucket.
 *
 * @param {string} Google Cloud bucket name
 */
async function backupS3Bucket(bucketName) {
    // List files in bucket
    const bucket = storage.bucket(bucketName);
    const files = await getFilesInBucket(bucket);
    
    if (files.length == 0) {
	console.log('No files found in bucket. Nothing to archive. Exiting.');
	process.exit();
    }

    // Prepare local directory paths
    const tempDir = `${path.sep}tmp`;
    const backupName = getBackupName();
    const backupDirPath = `${tempDir}${path.sep}${backupName}`;
    const bucketDirPath = `${backupDirPath}${path.sep}${bucketName}`;


    
    // Download each file into backup directory
    for (const file of files) {
	// Skip directory names
	if (!file.name.endsWith('/')) {
	    const destFilePath = `${bucketDirPath}${path.sep}${file.name}`;

	    // This directory has at least one file, so create it
	    const destDir = path.dirname(destFilePath);
	    createDirectory(destDir);
	    
	    const fileContents = await downloadFileFromBucket(bucket, file.name, destFilePath);
	    console.log(`Downloaded ${destFilePath}`);
	}
    }

    // Create a tarball archive of backup directory in current directory
    const tarFilePath = `.${path.sep}${backupName}.tar`;
    tar.c({
	gzip: true,
	file: tarFilePath,
	C: tempDir
    }, [backupName])
	.then(result => console.log('Created backup in this directory:', tarFilePath))
        .catch(error => {
	    console.error('ERROR: Failed to create backup');
	    console.error(error);
	    process.exit(1);
	});

    // Delete backup directory, leaving behind only the tarball
    
}

/*
 * List all accessible files in bucket, hiding any inaccessible files.
 *
 * @param {Bucket} Google Cloud bucket
 * @returns {Array of File} List of files in bucket, on success
 */
async function getFilesInBucket(bucket) {
    return bucket
	.getFiles()
        // GetFilesResponse object's parameter 0 is array of File
        // TODO: Will fileResponse[0] throw exception if empty bucket?
        .then(fileResponse => fileResponse[0])
	.catch(error => {
	    console.error('ERROR: Failed to find bucket or list files in bucket');
	    console.error(error);
	    process.exit(1);
	});
}

/*
 * Download an individual file's contents from a bucket to the local machine.
 *
 * @param {Bucket} Google cloud bucket
 * @param {string} Name of file in bucket
 * @param {string} Full path to the backup file
 * @returns {Buffer} Contents of the downloaded file
 */
async function downloadFileFromBucket(bucket, srcFileName, destFilePath) {
    const options = {
	destination: destFilePath
    }
    
    return bucket
	.file(srcFileName)
	.download(options)
	.then(fileContents => fileContents)
	.catch(error => {
	    console.warn(`WARNING: Failed to download ${srcFileName} to ${destFilePath}. Continuing.`);
	    console.warn(error);
	});
}

/*
 * Create a directory recursively and synchronously
 *
 * @param {string} Full path to directory
 */
function createDirectory(dirPath) {
    // Only create if doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }, (error) => {
            if (error) {
	        console.error('ERROR: Failed to create directory', dirPath);
	        console.error(error);
	        process.exit(1);
	    }
        });
    }
}

/*
 * Delete a directory recursively and synchronously
 *
 * @param {string} Full path to directory
 */
function deleteDirectory(dirPath) {

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


/*
 * ENTRY
 */

// Read command-line arguments
const args = process.argv;
if (args.length != 3) {
    console.error('ERROR: Incorrect number of arguments');
    console.error('Usage: node backup.js <bucketName>');
    process.exit(1);
}

const bucketName = args[2];
backupS3Bucket(bucketName);

