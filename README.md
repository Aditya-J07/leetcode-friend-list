# LeetCode Friends Extension

A lightweight Chrome extension that adds a **Friends system** to LeetCode. Easily add friends from any profile page, manage your friend list, and quickly access their profiles—all without leaving LeetCode.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange?style=flat&logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

* **One-Click Friend Adding**: Visit any LeetCode profile and click "➕ Add Friend" to save them instantly.
* **Persistent Storage**: Friends are synced across all your Chrome devices using `chrome.storage.sync`.
* **Quick Access Popup**: Click the extension icon to view your entire friends list with direct profile links.
* **Easy Management**: Remove friends with a single click using the ❌ button.
* **Clean UI**: Minimalist design that blends seamlessly with LeetCode's interface.
* **Real-Time Updates**: Button status updates immediately when you add or remove friends.

## 📸 Screenshots

*Coming soon: Add screenshots of the extension in action*

## 🚀 Installation

### Option 1: Load Unpacked (Developer Mode)

1. **Download or Clone** this repository:
   ```bash
   git clone https://github.com/yourusername/leetcode-friends-extension.git
   ```

2. **Open Chrome Extensions**:
   - Navigate to `chrome://extensions/`
   - Toggle **Developer mode** on (top-right corner)

3. **Load the Extension**:
   - Click **Load unpacked**
   - Select the `leetcode-friends-extension` folder

4. **Start Using**:
   - Visit any LeetCode profile (e.g., `https://leetcode.com/u/username/`)
   - Click the "➕ Add Friend" button
   - Access your friends list by clicking the extension icon

### Option 2: Install from Chrome Web Store

*Coming soon: Link to Chrome Web Store listing*

## 📁 Project Structure

```
leetcode-friends-extension/
│
├── manifest.json        # Extension configuration
├── content.js          # Injects "Add Friend" button on profile pages
├── popup.html          # Friends list popup interface
├── popup.js            # Manages friends list display and removal
├── style.css           # Styling for button and popup
└── README.md           # You are here!
```

## 🎯 How It Works

1. **Profile Detection**: The content script (`content.js`) detects when you're on a LeetCode profile page by parsing the URL.

2. **Button Injection**: A styled "➕ Add Friend" button is dynamically injected near the username on profile pages.

3. **Storage Management**: When clicked, the username is saved to `chrome.storage.sync`, making it available across all your synced Chrome browsers.

4. **Popup Display**: Click the extension icon to open a popup showing all your friends with:
   - Clickable links to their profiles
   - Delete buttons to remove friends

5. **State Synchronization**: The button automatically updates to "✓ Added" if the profile is already in your friends list.

## 🛠️ Customization Tips

### Change Button Colors
Edit the `.leetcode-friend-button` class in `style.css`:
```css
.leetcode-friend-button {
  background: #FFA116;  /* Change this to your preferred color */
  color: white;
}
```

### Modify Button Text
Update the button text in `content.js`:
```javascript
button.textContent = '➕ Add Friend';  // Customize this text
```

### Adjust Popup Width
Change the body width in `style.css`:
```css
body {
  width: 320px;  /* Adjust popup width */
}
```

### Add Custom Icons
Replace the placeholder icons in `manifest.json` with your own 16x16, 48x48, and 128x128 PNG files.

## 🐛 Known Limitations

* **Profile URL Formats**: Works with both `/u/username/` and `/username/` formats. If LeetCode changes their URL structure, the regex in `content.js` may need updating.
* **Storage Limits**: Chrome sync storage has a quota (≈100KB). With average username lengths, you can store thousands of friends.
* **Desktop Only**: Currently designed for the desktop version of `leetcode.com`.
* **Dynamic Content**: Uses a MutationObserver to handle LeetCode's single-page app navigation, but very fast navigation might occasionally miss the button injection.

## 🔧 Troubleshooting

**Button not appearing?**
- Refresh the LeetCode profile page
- Make sure you're on a valid profile URL (`leetcode.com/u/username/`)
- Check that the extension is enabled in `chrome://extensions/`

**Friends not syncing?**
- Ensure you're signed into Chrome with sync enabled
- Check Chrome sync settings in `chrome://settings/syncSetup`

**Popup not showing friends?**
- Right-click the extension icon → Inspect popup → Check console for errors
- Verify data exists: Open DevTools → Application → Storage → Chrome Extension Storage

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contributions
- Add friend categories/tags
- Import/export friends list
- Show friend statistics (problems solved, ranking, etc.)
- Dark mode support
- Friend activity notifications

## 💡 Acknowledgments

- Inspired by the need for better social features on LeetCode
- Built with Manifest V3 for future-proof Chrome extension development
- Thanks to the LeetCode community for testing and feedback


**Enjoy connecting with fellow LeetCoders! 🚀**

*If you find this extension useful, consider giving it a ⭐ on GitHub!*
