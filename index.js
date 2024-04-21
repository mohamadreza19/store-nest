const {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");
const s3 = new S3Client({
  region: "default",
  endpoint: "https://s3.ir-thr-at1.arvanstorage.ir",
  credentials: {
    accessKeyId: "b211b927-7f27-4996-9089-d451883fae25",
    secretAccessKey:
      "3602358e7b87df59442ebae7a9d15ac5ab2c7014d99ad6bbb97dc61432107d6b",
  },
});

const uploadParams = {
  Bucket: "store19",
  Key: "simple",
  ACL: "public-read",
};

// BODY (the contents of the uploaded file - leave blank/remove to retain contents of original file.)
const file = "./files/simple.jpg"; //FILE_NAME (the name of the file to upload (if you don't specify KEY))

// call S3 to retrieve upload file to specified bucket
const run = async () => {
  // Configure the file stream and obtain the upload parameters

  const fileStream = fs.createReadStream(file);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });
  uploadParams.Key = path.basename(file);
  // call S3 to upload file to specified bucket
  uploadParams.Body = fileStream;

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
};
const run_2 = async () => {
  try {
    const response = await s3.send(
      new ListObjectsCommand({
        Bucket: "store19",
      })
    );
    console.log("Success", response);
  } catch (err) {
    console.log("Error", err);
  }
};
const run_3 = async () => {
  const param = { Bucket: "store19", Key: "simple.jpg" };
  try {
    const data = await s3.send(new GetObjectCommand(param));
    const ws = fs.createWriteStream(
      __dirname + "/files/download-from-nodejs-sdk.jpg"
    );
    console.log(data.Body.buffer);
    // data.Body.pipe(ws);
    console.log("Success");
  } catch (err) {
    console.log("Error", err);
  }
};
const run_4 = async () => {
  try {
    const data = await s3.send(
      new DeleteObjectCommand({
        Bucket: "store19",
        Key: "simple.jpg",
        // VersionId: 'version2.2',
      })
    );
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
};

run();
// run_2();
//   run_3();
// run_4()
