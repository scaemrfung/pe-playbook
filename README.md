# Prairie PE Playbook (Grades 1–6)

Static website of 30-minute PE lessons for Alberta Grades 1–6.
Monthly themes follow a school yearly PE plan for Grades 1–6.

## Publish on GitHub Pages (about 5 minutes)

1. Go to [github.com/new](https://github.com/new) and sign in.
2. Repository name: `pe-playbook` (or any name).
3. Set visibility to **Public**.
4. Do **not** add a README if you are uploading these files.
5. Click **Create repository**.
6. On the next screen choose **uploading an existing file**.
7. Drag every file from this folder onto the page:
   - `index.html`
   - `month.html`
   - `games.html`
   - `how.html`
   - `gymnastics.html`
   - `styles.css`
   - `data.js`
   - `app.js`
   - `games-data.js`
   - `outcomes-data.js`
   - `k2-games.js`
   - `g36-games.js`
   - `README.md`
8. Click **Commit changes**.
9. Open the repo **Settings** tab → **Pages** (left sidebar).
10. Under **Build and deployment**:
    - Source: **Deploy from a branch**
    - Branch: **main** (or `master`)
    - Folder: **/ (root)**
11. Click **Save**.
12. Wait 1–2 minutes. Your site will be at:

    `https://YOUR-USERNAME.github.io/pe-playbook/`

If the month pages 404, wait another minute, then hard-refresh.

## Optional: Git on your computer

```bash
cd pe-playbook-site
git init
git add .
git commit -m "PE playbook site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pe-playbook.git
git push -u origin main
```

Then complete steps 9–12 above.

## Use it in Google Sites

After Pages is live, in Google Sites: **Insert → Embed** and paste the GitHub Pages URL.
