import * as path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import type { Repo } from "./sync-configs";
import { REPOS_DIR } from "./sync-configs";

export async function cloneOrPullRepo(repo: Repo, defaultBranch: string, authToken?: string): Promise<void> {
  const repoPath = path.join(__dirname, REPOS_DIR, repo.localDir);
  const repoUrl = authToken ? repo.url.replace("https://github.com/", `https://${authToken}@github.com/`) : repo.url;

  const git: SimpleGit = simpleGit();

  if (await git.checkIsRepo()) {
    console.log(`Updating ${repo.url}...`);
    try {
      await git.fetch("origin");
      await git.reset(["--hard", `origin/${defaultBranch}`]);
      await git.clean("f", ["-d"]);
    } catch (error) {
      console.error(`Error updating ${repo.url}:`, error);
      throw error;
    }
  } else {
    console.log(`Cloning ${repo.url}...`);
    try {
      await git.clone(repoUrl, repoPath);
    } catch (error) {
      console.error(`Error cloning ${repo.url}:`, error);
      throw error;
    }
  }
}
