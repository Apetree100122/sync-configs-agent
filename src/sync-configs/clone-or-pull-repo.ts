import simpleGit from "simple-git";
import * as path from "path";
import fs from "fs";
import type { Repo } from "./sync-configs";
import { REPOS_DIR } from "./sync-configs";

/**
 * Clones or pulls the specified repository.
 *
 * @param repo - The repository details.
 * @param defaultBranch - The default branch name (e.g., 'main').
 */
export async function cloneOrPullRepo(repo: Repo, defaultBranch: string): Promise<void> {
  const repoPath = path.join(__dirname, REPOS_DIR, repo.localDir);
  const token = process.env.GITHUB_TOKEN;
  const authenticatedUrl = repo.url.replace("https://", `https://${token}@`);

  const git = simpleGit();

  if (fs.existsSync(repoPath)) {
    try {
      console.log(`Updating ${repo.url}...`);
      await git.cwd(repoPath);
      await git.fetch("origin");
      await git.reset(["--hard", `origin/${defaultBranch}`]);
      await git.clean("f", ["-d"]);
      console.log(`Successfully updated ${repo.url}`);
    } catch (error) {
      console.error(`Error updating ${repo.url}: ${error.message}`);
      // Add more detailed error logging here
      throw error;
    }
  } else {
    try {
      console.log(`Cloning ${repo.url} into ${repoPath}...`);
      await git.clone(authenticatedUrl, repoPath);
      console.log(`Successfully cloned ${repo.url}`);
    } catch (error) {
      console.error(`Error cloning ${repo.url}: ${error.message}`);
      // Add more detailed error logging here
      throw error;
    }
  }
}
