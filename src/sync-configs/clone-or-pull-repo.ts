import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs"; // Ensure fs is imported
import type { Repo } from "./sync-configs";
import { REPOS_DIR } from "./sync-configs";

/**
 * Clones or pulls the specified repository.
 *
 * @param repo - The repository details.
 * @param defaultBranch - The default branch name (e.g., 'main').
 * @param authToken - Optional authentication token for private repos.
 */
export async function cloneOrPullRepo(repo: Repo, defaultBranch: string, authToken?: string): Promise<void> {
  const repoPath = path.join(__dirname, REPOS_DIR, repo.localDir);

  // URL-encode the token to handle special characters
  const encodedToken = authToken ? encodeURIComponent(authToken) : "";

  const repoUrl = authToken ? repo.url.replace("https://github.com/", `https://${encodedToken}@github.com/`) : repo.url;

  const git: SimpleGit = simpleGit(repoPath); // Initialize with repoPath

  if (fs.existsSync(repoPath)) {
    try {
      console.log(`Updating ${repo.url}...`);
      await git.fetch("origin");
      await git.reset(["--hard", `origin/${defaultBranch}`]);
      await git.clean("f", ["-d"]);
      // Removed git.pull() as it's redundant
    } catch (error) {
      console.error(`Error updating ${repo.url}:`, error);
      throw error;
    }
  } else {
    try {
      console.log(`Cloning ${repo.url} into ${repoPath}...`);
      await git.clone(repoUrl, repoPath);
    } catch (error) {
      console.error(`Error cloning ${repo.url}:`, error);
      throw error;
    }
  }
}
