# Raees Raqeeb — Personal Portfolio

A modern, responsive personal portfolio website built with plain **HTML**, **CSS**, and **vanilla JavaScript**. No build step, no frameworks — runs directly on GitHub Pages.

## ✨ Features

- **Dynamic GitHub projects** — fetched live from the GitHub REST API, sorted by stars or last updated
- **Dark / Light mode** toggle with preference saved to `localStorage`
- **Responsive** — works on desktop, tablet, and mobile
- **Sections:** Hero · About · Skills & Tech Stack · Projects · Contact
- **No build step** required — deploy in one click

## 🚀 Deploying to GitHub Pages

1. **Fork or clone** this repository into an account where the repo name matches `<username>.github.io`.
2. Go to **Settings → Pages** in your repository.
3. Under **Source**, select:
   - Branch: `main` (or whichever branch holds your code)
   - Folder: `/ (root)`
4. Click **Save**.

GitHub will automatically build and publish the site. It will be live at:

```
https://<username>.github.io/
```

> The first deployment usually takes 1–2 minutes.

## 🛠 Customising

| What to change | Where |
|---|---|
| Your name, bio, title | `index.html` — Hero section |
| About Me text | `index.html` — About section |
| Skills / icons | `index.html` — Skills section |
| Contact links (email, LinkedIn) | `index.html` — Contact section |
| Number of repos shown | `script.js` — `MAX_REPOS` constant |
| Default sort order | `script.js` — `currentSort` variable |
| Colours / fonts | `styles.css` — `:root` CSS variables |
| Profile photo | Replace `assets/profile.jpg` or update the `src` in the hero `<img>` tag |

## 📁 Project Structure

```
.
├── index.html        # Main HTML file (entry point)
├── styles.css        # All styles with dark/light theme variables
├── script.js         # GitHub API fetching + theme toggle + scroll-spy
├── assets/
│   └── profile.jpg   # Profile photo
└── README.md         # This file
```

## 🔧 Running Locally

No build tools needed — just open `index.html` in your browser, or use a simple static server:

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080
```

## 📄 License

MIT — free to use and adapt.
