# Auralis - Landing Page & Showcase Website

Welcome to the official landing page repository for **Auralis**, an advanced YouTube Music client built with Material Design 3 for Android & Windows.

This repository hosts the static website (available at your custom domain or GitHub Pages) that showcases the features, screenshots, downloads, and support channels for the Auralis application.

---

## 🎨 Website Features

- **Material Design 3 Aesthetics:** A premium, modern, and clean visual design utilizing dynamic lavender/purple colors matching Google's latest design guidelines.
- **Interactive Device Emulator:** A fully interactive simulated Android phone mock-up where users can browse features, mock music playback, and view real-time stats.
- **Platform Detection:** Automatically detects user platform (Android vs. Windows) to provide the appropriate download link.
- **Dynamic Release System:** Fetches releases directly using GitHub APIs to keep download links, file sizes, and changelogs up-to-date.
- **Responsive Layout:** Tailored layouts designed for mobile, tablet, and high-resolution desktop viewports.

---

## 🚀 How to Run Locally

You can run this project locally without any dependencies using a simple HTTP server:

### Python 3
```bash
python -m http.server 8000
```
Then, open your browser and navigate to `http://localhost:8000`.

### Node.js (http-server)
```bash
npx http-server -p 8000
```

---

## 📂 Project Structure

```text
├── assets/             # Images, screenshots, and application icons
├── css/
│   └── styles.css      # Core styles, emulator custom animations, and layout
├── js/
│   └── app.js          # Dynamic interactions, emulator views routing, and audio demo logic
├── index.html          # Main HTML5 entry document (Tailwind CSS CDN integration)
├── LICENSE             # GPL-3.0 License details
└── README.md           # Project documentation
```

---

## 👨‍💻 Developer & Team

- **Likith Yadav** - Lead Developer & Creator
  - [Portfolio Website](https://likithyadav.me)
  - [GitHub Profile](https://github.com/Likith-Yadav)
  - [Instagram](https://instagram.com/likithh_pvt)

---

## 📄 License

This website and the Auralis application are distributed under the **GNU General Public License v3.0**. See the [LICENSE](./LICENSE) file for more information.
