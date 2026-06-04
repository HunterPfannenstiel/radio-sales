# Clone Guide

Use this guide when spinning up a new project from this template.

## Instructions for Claude

1. Ask the user for a **project name** if they haven't provided one.
2. Ask the user for an **optional remote repo URL** (e.g. a new GitHub repo they've already created). If they don't have one, skip the remote setup commands.
3. Ask the user for an **optional Supabase bucket name**. If not provided, leave `SUPABASE_BUCKET` empty in `.env.local`.
4. Run the following commands, substituting the values provided:

```bash
mkdir <project-name> && cd <project-name>
git clone https://github.com/HunterPfannenstiel/mvp my-app
cd my-app
git remote remove origin
cp ../.env.local .env.local
pnpm install
```

After copying `.env.local`, if the user provided a bucket name, update `SUPABASE_BUCKET=` in `my-app/.env.local` with the value.

If a remote URL was provided:
```bash
git remote add origin <remote-repo-url>
git push -u origin main
```

## Key Rule

`my-app` is the git root and where all dev work happens. The outer `<project-name>` folder is just a namespaced container with no git history of its own.
