# nodejs-backup-s3-bucket

A Node.js script to create a backup of a publicly accessible Google cloud S3 bucket by downloading & storing all accessible files in a local tarball. This utilizes:

* [google-cloud/storage](https://www.npmjs.com/package/@google-cloud/storage) - Accesses Google Cloud S3 bucket
* [tar](https://www.npmjs.com/package/tar) - Compresses backup file

-----

**How to run locally:**

On Linux,
1.  Run ```npm install``` to install all needed dependencies.
2.  Run ```node backup.js <bucketname>```. Example: ```node backup.js nimactive```.

-----

**Output:**

This script will output a file in the current working directory with the following name:
```backup-<date>.tar```, where ```<date>``` is ```yyyy-mm-dd-hh-MM``` in GMT.

-----

**Assumptions:**

1.  The bucket will not be modified while the script is running.
2.  The user has sufficient privileges to write to ```/tmp``` (or create it) and the current working directory.
