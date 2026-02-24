# Open CTF Demo (GitHub Pages)

This is a **minimal static website** (HTML/CSS/JS) that mimics a CTF leaderboard site:
Rules → Dataset Access → Submit → Leaderboard.

It is designed to be hosted **as-is** on **GitHub Pages** (no backend required).

## Quick start (GitHub Pages)

1. Create a new GitHub repository (e.g., `open-ctf-demo`).
2. Upload the contents of this folder to the repo.
3. In GitHub: **Settings → Pages**
   - Build and deployment: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/docs`
4. Save. GitHub will publish your site at `https://<username>.github.io/<repo>/`.

## Local preview

From the project root:

```bash
cd docs
python -m http.server 8000
```

Then open: http://localhost:8000

## Updating the leaderboard

Edit:

- `docs/data/leaderboard.json`

Commit & push to GitHub. The site will update automatically.

## How to extend this into a real benchmark

This demo only covers the **front-end shell**. A full platform usually adds:

- authenticated upload portal (S3 / object storage)
- job queue (Redis/Celery) + sandbox runner (Docker/Apptainer, network-disabled)
- scoring service writing metrics to Postgres
- admin review/audit logs
