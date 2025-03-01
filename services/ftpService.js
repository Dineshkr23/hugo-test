import ftp from "basic-ftp";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export async function deployToFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log("🔄 Connecting to FTP...");
    console.log(process.env.FTP_HOST);
    console.log(process.env.FTP_USER);
    console.log(process.env.FTP_PASS);

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false, // Change to true if using FTPS
    });

    const localBuildPath = path.resolve("hugo-site/public"); // Hugo output directory
    const remotePath = process.env.FTP_REMOTE_PATH;

    console.log(
      `📂 Uploading Hugo build from ${localBuildPath} to ${remotePath}...`
    );

    // Ensure the remote path exists
    await client.ensureDir(remotePath);
    // await client.clearWorkingDir(); // Clear previous files (optional)

    // Upload all files recursively
    await uploadDirectory(client, localBuildPath, remotePath);

    console.log("✅ Hugo build deployed successfully!");
  } catch (error) {
    console.error(`❌ FTP Error: ${error.message}`);
  } finally {
    client.close();
  }
}

async function uploadDirectory(client, localDir, remoteDir) {
  const files = fs.readdirSync(localDir);

  for (const file of files) {
    const localFilePath = path.join(localDir, file);
    const remoteFilePath = path.posix.join(remoteDir, file); // Ensure correct FTP path formatting

    if (fs.statSync(localFilePath).isDirectory()) {
      await client.ensureDir(remoteFilePath);
      await uploadDirectory(client, localFilePath, remoteFilePath);
    } else {
      await client.ensureDir(remoteDir); // Ensure parent directory exists before uploading
      await client.uploadFrom(localFilePath, remoteFilePath);
      console.log(`📤 Uploaded: ${remoteFilePath}`);
    }
  }
}

// async function uploadDirectory(client, localDir, remoteDir) {
//   const files = fs.readdirSync(localDir);

//   for (const file of files) {
//     const localFilePath = path.join(localDir, file);
//     const remoteFilePath = `${remoteDir}/${file}`;

//     if (fs.statSync(localFilePath).isDirectory()) {
//       await client.ensureDir(remoteFilePath);
//       await uploadDirectory(client, localFilePath, remoteFilePath);
//     } else {
//       await client.uploadFrom(localFilePath, remoteFilePath);
//       console.log(`📤 Uploaded: ${remoteFilePath}`);
//     }
//   }
// }
