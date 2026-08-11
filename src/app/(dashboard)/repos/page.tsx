"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ConnectGithub } from "@/components/connect-github";

import {
ArrowRight,
CheckCircle,
FolderGit2,
Globe,
Lock,
Plus,
RefreshCw,
Search,
Star,
Trash2,
X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface GitHubRepo {
githubId: number;
name: string;
fullName: string;
private: boolean;
htmlUrl: string;
description: string | null;
language: string | null;
stars: number;
updatedAt: string;
}

const languageColors: Record<string, string> = {
TypeScript: "bg-blue-500",
JavaScript: "bg-yellow-400",
Python: "bg-green-500",
Go: "bg-cyan-500",
Rust: "bg-orange-500",
Java: "bg-red-500",
Ruby: "bg-red-400",
PHP: "bg-purple-500",
"C#": "bg-green-600",
"C++": "bg-pink-500",
C: "bg-gray-500",
Swift: "bg-orange-400",
Kotlin: "bg-purple-400",
Dart: "bg-blue-400",
Vue: "bg-emerald-500",
Svelte: "bg-orange-600",
};

export default function ReposPage() {
const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
const [showGitHubRepos, setShowGitHubRepos] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

const connectedRepos = trpc.repository.list.useQuery();

const githubRepos = trpc.repository.fetchFromGithub.useQuery(undefined, {
enabled: showGitHubRepos,
});

const connectMutation = trpc.repository.connect.useMutation({
onSuccess: () => {
connectedRepos.refetch();
setSelectedRepos(new Set());
setShowGitHubRepos(false);
setSearchQuery("");
},
});

const disconnectMutation = trpc.repository.disconnect.useMutation({
onSuccess: () => {
connectedRepos.refetch();
},
});

const connectedIds = new Set(
connectedRepos.data?.map((repo) => repo.githubId) ?? [],
);

const availableRepos =
githubRepos.data?.filter((repo) => !connectedIds.has(repo.githubId)) ?? [];

const normalizedSearch = searchQuery.trim().toLowerCase();

const filteredAvailableRepos = availableRepos.filter((repo) => {
if (!normalizedSearch) return true;

return (
  repo.name.toLowerCase().includes(normalizedSearch) ||
  repo.fullName.toLowerCase().includes(normalizedSearch) ||
  repo.description?.toLowerCase().includes(normalizedSearch)
);

});

const toggleRepo = (githubId: number) => {
setSelectedRepos((current) => {
const next = new Set(current);

  if (next.has(githubId)) {
    next.delete(githubId);
  } else {
    next.add(githubId);
  }

  return next;
});

};

const handleConnect = () => {
const reposToConnect = availableRepos
.filter((repo) => selectedRepos.has(repo.githubId))
.map((repo) => ({
githubId: repo.githubId,
name: repo.name,
fullName: repo.fullName,
private: repo.private,
htmlUrl: repo.htmlUrl,
}));

if (reposToConnect.length === 0) return;

connectMutation.mutate({
  repos: reposToConnect,
});
};

const selectAll = () => {
setSelectedRepos(
new Set(filteredAvailableRepos.map((repo) => repo.githubId)),
);
};

const clearSelection = () => {
setSelectedRepos(new Set());
};

const handleToggleGitHubRepos = () => {
setShowGitHubRepos((current) => !current);
setSearchQuery("");
setSelectedRepos(new Set());
};

return ( <div className="space-y-8">
{/* Header */} <div className="flex items-start justify-between gap-4"> <div> <h1 className="text-2xl font-semibold tracking-tight">
Repositories </h1>

```
      <p className="mt-1 text-muted-foreground">
        Select repositories to connect to your account.
      </p>
    </div>

    <Button
      onClick={handleToggleGitHubRepos}
      variant={showGitHubRepos ? "outline" : "default"}
      className="shrink-0 transition-all"
    >
      {showGitHubRepos ? (
        <>
          <X className="size-4" />
          Cancel
        </>
      ) : (
        <>
          <Plus className="size-4" />
          Add repository
        </>
      )}
    </Button>
  </div>

  {/* GitHub Repository Import */}
  {showGitHubRepos && (
    <Card className="animate-in overflow-hidden fade-in slide-in-from-top-2 duration-200">
      <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">
              Import GitHub repositories
            </h2>

            <p className="mt-0.5 text-sm text-muted-foreground">
              Select repositories to import from GitHub.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => githubRepos.refetch()}
            disabled={githubRepos.isFetching}
            aria-label="Refresh repository list"
          >
            <RefreshCw
              className={cn(
                "size-4",
                githubRepos.isFetching && "animate-spin",
              )}
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Loading */}
        {githubRepos.isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-16 w-full rounded-lg"
              />
            ))}
          </div>
        ) : githubRepos.error ? (
          /* Error */
          <div className="p-6">
            {githubRepos.error.data?.code === "PRECONDITION_FAILED" ? (
              <ConnectGithub
                title="GitHub account not connected"
                description="Connect your GitHub account to view your repositories."
              />
            ) : (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center">
                <p className="text-sm text-destructive">
                  {githubRepos.error.message}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => githubRepos.refetch()}
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        ) : availableRepos.length === 0 ? (
          /* Empty */
          <div className="py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="size-6 text-emerald-500" />
            </div>

            <p className="mt-4 font-medium">All caught up!</p>

            <p className="mt-1 text-sm text-muted-foreground">
              All your repositories are already connected.
            </p>
          </div>
        ) : (
          <>
            {/* Search / Selection Controls */}
            <div className="flex items-center gap-4 border-b border-border/60 px-6 py-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search repositories"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  className="pl-10"
                />
              </div>

              <div className="flex shrink-0 items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Select all
                </button>

                {selectedRepos.size > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>

                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Repository List */}
            <div className="max-h-[25rem] overflow-y-auto">
              {filteredAvailableRepos.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No repositories match your search.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {filteredAvailableRepos.map((repo) => (
                    <RepoSelectItem
                      key={repo.githubId}
                      repo={repo}
                      selected={selectedRepos.has(repo.githubId)}
                      onToggle={() => toggleRepo(repo.githubId)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Connect Footer */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/60 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                {selectedRepos.size} of{" "}
                {filteredAvailableRepos.length} selected
              </p>

              <Button
                onClick={handleConnect}
                disabled={
                  selectedRepos.size === 0 ||
                  connectMutation.isPending
                }
              >
                {connectMutation.isPending ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect
                    {selectedRepos.size > 0 &&
                      ` (${selectedRepos.size})`}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )}

  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Connected repositories
      </h2>

      {connectedRepos.data && connectedRepos.data.length > 0 && (
        <Badge variant="secondary" className="tabular-nums">
          {connectedRepos.data.length}
        </Badge>
      )}
    </div>

    {connectedRepos.isLoading ? (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-24 w-full rounded-xl"
          />
        ))}
      </div>
    ) : connectedRepos.error ? (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-destructive">
            {connectedRepos.error.message}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => connectedRepos.refetch()}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    ) : connectedRepos.data?.length === 0 ? (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
            <FolderGit2 className="size-7 text-muted-foreground" />
          </div>

          <p className="mt-4 font-medium">
            No connected repositories yet
          </p>

          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Connect your GitHub repositories to start getting
            AI-powered code reviews on your pull requests.
          </p>

          <Button
            className="mt-6"
            onClick={() => setShowGitHubRepos(true)}
          >
            <Plus className="size-4" />
            Add your first repository
          </Button>
        </CardContent>
      </Card>
    ) : (
      <div className="grid gap-3 sm:grid-cols-2">
        {connectedRepos.data?.map((repo) => (
          <ConnectedRepoCard
            key={repo.id}
            repo={repo}
            onDisconnect={() =>
              disconnectMutation.mutate({ id: repo.id })
            }
            isDisconnecting={disconnectMutation.isPending}
          />
        ))}
      </div>
    )}
  </div>
</div>


);
}

function ConnectedRepoCard({
repo,
onDisconnect,
isDisconnecting,
}: {
repo: {
id: string;
fullName: string;
private: boolean;
createdAt: Date;
};
onDisconnect: () => void;
isDisconnecting: boolean;
}) {
return ( <Card className="group transition-all hover:border-primary/30 hover:shadow-sm"> <CardContent className="p-5"> <div className="flex items-start justify-between gap-3">
{/* Repository Link */}
<Link
href={`/repos/${repo.id}`}
className="group/link min-w-0 flex-1"
> <div className="flex items-start gap-3">
<div
className={cn(
"flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
repo.private
? "bg-amber-500/10 group-hover:bg-amber-500/15"
: "bg-emerald-500/10 group-hover:bg-emerald-500/15",
)}
>
{repo.private ? ( <Lock className="size-4 text-amber-600 dark:text-amber-400" />
) : ( <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
)} </div>

          <div className="min-w-0">
            <span className="block truncate font-medium transition-colors group-hover/link:text-primary">
              {repo.fullName}
            </span>

            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-5 px-1.5 text-xs"
              >
                {repo.private ? "Private" : "Public"}
              </Badge>
            </div>
          </div>
        </div>
      </Link>


      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isDisconnecting}
            aria-label={`Disconnect ${repo.fullName}`}
            className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Disconnect repository
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to disconnect{" "}
              <span className="font-medium text-foreground">
                {repo.fullName}
              </span>
              ? This will remove all review history for this
              repository.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={onDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>


    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
      <span className="text-xs text-muted-foreground">
        Connected {formatDate(repo.createdAt)}
      </span>

      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 text-xs"
      >
        <Link href={`/repos/${repo.id}`}>
          View PRs
          <ArrowRight className="size-3" />
        </Link>
      </Button>
    </div>
  </CardContent>
</Card>


);
}

function RepoSelectItem({
repo,
selected,
onToggle,
}: {
repo: GitHubRepo;
selected: boolean;
onToggle: () => void;
}) {
const langColor = repo.language
? languageColors[repo.language] ?? "bg-gray-400"
: null;

const checkboxId = `repo-${repo.githubId}`;

return (
<div
className={cn(
"flex items-center gap-4 px-6 py-4 transition-colors",
selected ? "bg-primary/5" : "hover:bg-muted/50",
)}
>
<Checkbox
id={checkboxId}
checked={selected}
onCheckedChange={onToggle}
className="shrink-0"
aria-label={`Select ${repo.fullName}`}
/>


  <label
    htmlFor={checkboxId}
    className="min-w-0 flex-1 cursor-pointer"
  >
    <div className="flex items-center gap-2">
      <span className="truncate font-medium">
        {repo.fullName}
      </span>

      {repo.private && (
        <Lock className="size-3 shrink-0 text-muted-foreground" />
      )}
    </div>

    {repo.description && (
      <p className="mt-0.5 truncate text-sm text-muted-foreground">
        {repo.description}
      </p>
    )}
  </label>

  <div className="flex shrink-0 items-center gap-4">
    {repo.stars > 0 && (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="size-3" />
        <span className="tabular-nums">{repo.stars}</span>
      </span>
    )}

    {repo.language && (
      <div className="flex items-center gap-1.5">
        {langColor && (
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              langColor,
            )}
          />
        )}

        <span className="text-xs text-muted-foreground">
          {repo.language}
        </span>
      </div>
    )}
  </div>
</div>

);
}

function formatDate(date: Date): string {
const now = new Date();
const targetDate = new Date(date);

const diffMs = now.getTime() - targetDate.getTime();
const diffDays = Math.floor(
diffMs / (1000 * 60 * 60 * 24),
);

if (diffDays <= 0) return "today";
if (diffDays === 1) return "yesterday";
if (diffDays < 7) return `${diffDays} days ago`;
if (diffDays < 30) {
return `${Math.floor(diffDays / 7)} weeks ago`;
}
if (diffDays < 365) {
return `${Math.floor(diffDays / 30)} months ago`;
}

return targetDate.toLocaleDateString("en-US", {
month: "short",
day: "numeric",
year: "numeric",
});
}

