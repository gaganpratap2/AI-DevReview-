import { db } from "@/server/db";

export interface GitHubPullRequestFile {
  sha: string;
  filename: string;
  status:
    | "added"
    | "removed"
    | "modified"
    | "renamed"
    | "copied"
    | "changed"
    | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  draft: boolean;

  head: {
    ref: string;
    sha: string;
  };

  base: {
    ref: string;
  };

  additions?: number;
  deletions?: number;
  changed_files?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

const GITHUB_API = "https://api.github.com";

async function githubFetch<T>(
  accessToken: string,
  path: string,
): Promise<T> {
  const url = `${GITHUB_API}${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub API ${response.status} ${response.statusText}: ${body}`,
    );
  }

  return (await response.json()) as T;
}

export async function getGitHubAccessToken(
  userId: string,
): Promise<string | null> {
  const account = await db.account.findFirst({
    where: {
      userId,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });

  return account?.accessToken ?? null;
}

export async function fetchGitHubRepos(
  accessToken: string,
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await githubFetch<GitHubRepo[]>(
      accessToken,
      `/user/repos?per_page=${perPage}&page=${page}&sort=updated`,
    );

    repos.push(...data);

    if (data.length < perPage) {
      break;
    }

    page++;
  }

  return repos;
}

export async function fetchPullRequests(
  accessToken: string,
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
): Promise<GitHubPullRequest[]> {
  const pulls = await githubFetch<GitHubPullRequest[]>(
    accessToken,
    `/repos/${owner}/${repo}/pulls?state=${state}&per_page=30&sort=updated&direction=desc`,
  );

  return pulls;
}

export async function fetchPullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<GitHubPullRequest> {
  return githubFetch<GitHubPullRequest>(
    accessToken,
    `/repos/${owner}/${repo}/pulls/${prNumber}`,
  );
}

export async function fetchPullRequestFiles(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<GitHubPullRequestFile[]> {
  const files: GitHubPullRequestFile[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await githubFetch<GitHubPullRequestFile[]>(
      accessToken,
      `/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=${perPage}&page=${page}`,
    );

    files.push(...data);

    if (data.length < perPage) {
      break;
    }

    page++;
  }

  return files;
}
