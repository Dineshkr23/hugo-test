import { exec } from "child_process";
import path from "path";
import os from "os";

export async function pushChangesToGitHub(blogTitle) {
  const REPO_PATH = path.resolve("hugo-site"); // Adjust this path if needed
  const GIT_REMOTE = "https://github.com/Dineshkr23/hugo-test.git";

  // Check OS and set shell accordingly
  const isWindows = os.platform() === "win32";
  const shell = isWindows ? "cmd.exe" : "/bin/bash";

  // Use correct SSH key path for each OS
  const SSH_KEY_PATH = isWindows
    ? "C:/Users/DINESH/.ssh/id_rsa"
    : "/home/your-user/.ssh/id_rsa"; // Change for Linux

  const command = `
    cd ${REPO_PATH} && 
    git config user.name "Dineshkr23" && 
    git config user.email "dksharma25@live.com" && 
    git add . && 
    git commit -m "New blog post: ${blogTitle}" && 
    git push ${GIT_REMOTE} main --force
  `;

  console.log(`Executing command: ${command}`);

  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        shell,
        env: {
          ...process.env,
          GIT_SSH_COMMAND: `ssh -i "${SSH_KEY_PATH}" -o StrictHostKeyChecking=no`,
        },
      },
      (error, stdout, stderr) => {
        if (stderr) console.warn(`Git warnings: ${stderr}`);
        if (error) {
          console.error(`Git error: ${error.message}`);
          reject(new Error("Failed to push changes to GitHub"));
        } else {
          console.log(`Git output: ${stdout}`);
          resolve("Blog updated and pushed to GitHub");
        }
      }
    );
  });
}
