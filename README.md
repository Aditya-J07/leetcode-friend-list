# 🚀 LeetCode Friends - Your Coding Companion

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange?style=for-the-badge&logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)

**Track friends, compare stats, maintain streaks, and stay motivated on your LeetCode journey!**

[Features](#-features) • [Installation](#-installation) • [Screenshots](#-screenshots) • [Usage](#-usage) • [Contributing](#-contributing)

---

</div>

## ✨ Features

### 👥 **Advanced Friend Management**
- 🎯 **One-Click Adding**: Floating "➕ Add Friend" button on any LeetCode profile
- ↕️ **Drag & Drop Reordering**: Organize friends exactly how you want
- 🔄 **Real-Time Stats**: Live problem counts with color-coded difficulty badges
- ❌ **Instant Removal**: Delete friends with a single click
- ☁️ **Cross-Device Sync**: Chrome Storage API syncs across all your devices
- 🎨 **Skeleton Loaders**: Beautiful animated placeholders during data fetching

### 📊 **Personal Dashboard**
- 👤 **Your Profile**: Track your own stats at the top of the popup
- 📈 **Live Stats Display**: See Total, Easy, Medium, and Hard problem counts
- ✏️ **Easy Editing**: Change your username anytime
- 🔗 **Quick Links**: Click your username to visit your profile

### 🏆 **Competitive Leaderboard**
- 📊 **Compare with Friends**: See how you stack up against your network
- 🥇🥈🥉 **Medal Rankings**: Top 3 get special recognition
- 📉 **Sorted by Performance**: Automatic ranking by total problems solved
- 💡 **Highlight Your Position**: Your rank is visually emphasized
- 🔢 **Detailed Breakdown**: Compare Easy, Medium, and Hard counts side-by-side

### 🔥 **Streak Reminder System**
- 🔴 **Visual Indicators**: Pulsing red dot when you haven't solved today
- 🔔 **Badge Notifications**: Extension icon shows "!" badge for streak breaks
- 📢 **Desktop Alerts**: Smart notifications after 8 PM (once per day)
- ⏰ **Auto-Monitoring**: Background checks every 30 minutes
- 🎯 **Personalized Messages**: Uses your username in reminders

### 🎨 **Beautiful Dark Theme UI**
- 🌙 **LeetCode-Inspired Design**: Matches the platform's aesthetic perfectly
- 🎨 **Color-Coded Stats**: 
  - Grey for Total
  - Green for Easy
  - Orange for Medium
  - Red for Hard
- ✨ **Smooth Animations**: Hover effects, transitions, and pulsing indicators
- 💻 **Monospace Font**: Coding-style numbers for that authentic feel
- 📱 **Responsive Layout**: Clean, organized interface

### ⚡ **Smart Features**
- 🔄 **Refresh Button**: Manually reload all stats with spinning animation
- 🚫 **Duplicate Prevention**: Can't add the same friend twice
- 🔍 **Profile Detection**: Works with both `/u/username/` and legacy URLs
- 🔄 **SPA Navigation Support**: Handles LeetCode's dynamic page updates
- ⚠️ **Error Handling**: Graceful degradation when API fails
- 💾 **Persistent Storage**: Your data is safe and backed up

---

## 📸 Screenshots

<div align="center">

### 🌟 Main Popup Interface
*Personal dashboard + friends list with live stats*

<img width="1919" height="907" alt="Profile SS" src="https://github.com/user-attachments/assets/07148f73-ba79-437a-af69-ad9f2e06d66a" />

### ➕ Add Friend Button on Profile
*Floating button appears on any LeetCode profile page*

<img width="1919" height="907" alt="Extension Popup" src="https://github.com/user-attachments/assets/7d1c90d9-0f1f-4037-9a38-db5f90f7a313" />

### 🏆 Comparison Leaderboard
*See how you rank among your friends*

<!-- Add your comparison screenshot here -->

### 🔥 Streak Reminder
*Red dot indicator when you haven't solved today*

<!-- Add your streak indicator screenshot here -->

</div>

---

## 🚀 Installation

### Method 1: Install from Source (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/leetcode-friends-extension.git
   cd leetcode-friends-extension
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the `leetcode-friends-extension` folder

4. **Initial Setup**
   - Click the extension icon in your toolbar
   - Enter your LeetCode username
   - Click **Save**
   - You're all set! 🎉

### Method 2: Chrome Web Store

*Coming soon! Star ⭐ this repo to get notified when it's published.*

---

## 📖 Usage Guide

### Adding Friends

1. Visit any LeetCode profile (e.g., `https://leetcode.com/u/username/`)
2. Look for the orange "➕ Add Friend" button in the top-right
3. Click to add them to your list
4. Button changes to "✓ Added" for confirmation

### Viewing Your Dashboard

1. Click the extension icon in your Chrome toolbar
2. See your personal stats at the top
3. View all friends below with their stats
4. Click any username to visit their profile

### Comparing Performance

1. Open the extension popup
2. Click the **📊** button (Compare with friends)
3. See the leaderboard with rankings
4. Your position is highlighted in orange

### Reordering Friends

1. Click the **↕️** button (Reorder friends)
2. Drag and drop friends to rearrange
3. Click **✓** when done
4. Order is automatically saved

### Refreshing Stats

1. Click the **🔄** button at any time
2. All stats reload with fresh data
3. Streak status is rechecked

### Managing Streak Reminders

- **Red Dot**: Appears in popup when you haven't solved today
- **Badge**: Extension icon shows "!" in your toolbar
- **Notification**: Desktop alert appears after 8 PM
- **Disable**: Currently always-on (future update will add settings)

---

## 📁 Project Structure

```
leetcode-friend-list/
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── manifest.json
├── content.js
├── style.css
├── popup.html
├── popup.css
├── popup.js
├── background.js
├── README.md
└── .gitignore
```

---

## 🔧 Technical Details

### How It Works

#### 1. Profile Detection (`content.js`)
```javascript
// Monitors URL for LeetCode profile patterns
const match = url.match(/leetcode\.com\/u\/([^\/\?]+)/);
// Injects floating button on match
```

#### 2. Data Storage
```javascript
// Uses Chrome Storage Sync API
chrome.storage.sync.set({ friends: [...] });
// Automatically syncs across devices
```

#### 3. Stats Fetching (`popup.js`)
```javascript
// LeetCode GraphQL API
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats { acSubmissionNum { difficulty, count } }
  }
}
```

#### 4. Streak Monitoring (`background.js`)
```javascript
// Service worker checks every 30 minutes
chrome.alarms.create('checkStreak', { periodInMinutes: 30 });
// Queries recent submissions via GraphQL
// Sets badge and sends notifications
```

### API Endpoints Used

| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `leetcode.com/graphql` | User stats | ~100 requests/min |
| `leetcode.com/graphql` | Recent submissions | ~100 requests/min |

### Data Storage

| Key | Type | Purpose | Sync |
|-----|------|---------|------|
| `myUsername` | String | Your LeetCode username | ✅ |
| `friends` | Array | List of friend usernames | ✅ |
| `lastNotificationDate` | String | Last streak reminder date | ✅ |

### Permissions Explained

| Permission | Why We Need It |
|------------|----------------|
| `storage` | Save friends and settings |
| `alarms` | Schedule streak checks |
| `notifications` | Desktop reminders |
| `host_permissions` | Access LeetCode's GraphQL API |

---

## 🎨 Customization Guide

### Change Color Scheme

Edit `popup.css`:

```css
/* Primary accent color */
.stat-number.total { color: #YOUR_COLOR; }

/* Background colors */
body { background: #1a1a1a; }
.friend-item { background: #262626; }

/* Difficulty colors */
.stat-number.easy { color: #00b8a3; }    /* Green */
.stat-number.medium { color: #ffc01e; }  /* Orange */
.stat-number.hard { color: #ef4743; }    /* Red */
```

### Adjust Notification Time

Edit `background.js`:

```javascript
// Default: 8 PM (20:00)
if (lastNotified !== today && currentHour >= 20) {
  // Change 20 to your preferred hour (24-hour format)
}
```

### Change Check Frequency

Edit `background.js`:

```javascript
chrome.alarms.create('checkStreak', {
  periodInMinutes: 30  // Change to 60 for hourly, 15 for every 15 min
});
```

### Modify Button Position

Edit `style.css`:

```css
.leetcode-friend-button-fixed {
  top: 80px;    /* Distance from top */
  right: 20px;  /* Distance from right */
}
```

### Customize Button Text

Edit `content.js`:

```javascript
button.textContent = '➕ Add Friend';  // Change to your text
// Or use emojis: '🤝 Follow', '👥 Add', etc.
```

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ Button not appearing on profile pages?</b></summary>

**Solutions:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Verify URL format: Must be `leetcode.com/u/username/`
3. Check extension status: `chrome://extensions/` → Ensure toggle is ON
4. Clear cache: `Ctrl + Shift + Delete` → Clear "Cached images and files"
5. Check console: F12 → Console tab → Look for errors

**Common causes:**
- LeetCode changed their page structure
- AdBlocker interfering with content scripts
- Browser needs restart
</details>

<details>
<summary><b>📊 Stats showing "?" or not loading?</b></summary>

**Solutions:**
1. Click the 🔄 refresh button
2. Check internet connection
3. Verify username is spelled correctly
4. Wait 2-3 minutes (API rate limiting)
5. Try a different profile to isolate issue

**Note:** LeetCode API occasionally has downtime or rate limits requests.
</details>

<details>
<summary><b>☁️ Friends not syncing across devices?</b></summary>

**Solutions:**
1. Enable Chrome Sync: `chrome://settings/syncSetup`
2. Sign in to the same Google account on all devices
3. Check "Extensions" is enabled in sync settings
4. Wait 5-10 minutes for sync to propagate
5. Force sync: `chrome://sync-internals/` → "Trigger GetUpdates"

**Requirements:**
- Same Google account on all devices
- Chrome sync enabled
- Internet connection active
</details>

<details>
<summary><b>🔴 Red dot not showing/Badge missing?</b></summary>

**Solutions:**
1. Set your username in "My Profile" section
2. Click 🔄 to manually refresh
3. Verify you haven't solved problems in last 24 hours
4. Check notification permissions: `chrome://extensions/` → Details → Permissions
5. Restart Chrome

**Technical check:**
- Open popup → F12 → Console → Look for "checkUserStreak" logs
</details>

<details>
<summary><b>⚠️ "Extension context invalidated" error?</b></summary>

**This happens when:**
- You reload the extension while a page is open
- Chrome updates the extension

**Solution:**
1. Simply refresh the LeetCode page (F5)
2. Or click the "🔄 Refresh Page" button if it appears

**Prevention:** Close LeetCode tabs before reloading extension
</details>

<details>
<summary><b>🐌 Popup is slow/laggy?</b></summary>

**Solutions:**
1. Too many friends? Stats fetch sequentially (limit: ~20 friends)
2. Close other Chrome extensions temporarily
3. Clear Chrome cache
4. Update Chrome to latest version

**Technical:** Stats are fetched sequentially to avoid rate limits. With 10+ friends, expect 5-10 second load time.
</details>

<details>
<summary><b>🔄 Drag & drop not working?</b></summary>

**Solutions:**
1. Make sure you clicked the ↕️ button first
2. Button should turn to ✓ when reorder mode is active
3. Try refreshing the popup
4. Disable other extensions that might intercept drag events

**Note:** Must click ✓ to save new order
</details>

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/leetcode-friends-extension.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

4. **Commit with clear messages**
   ```bash
   git commit -m "Add: Feature description"
   # Use prefixes: Add, Fix, Update, Remove, Refactor
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues
   - Add screenshots if UI changes

### 💡 Feature Ideas (Help Wanted!)

**High Priority:**
- [ ] 🔍 **Search/Filter** friends by username
- [ ] 📤 **Export/Import** friends list (JSON format)
- [ ] 🏷️ **Tags/Categories** for friends (Study, Competitive, Mentor, etc.)
- [ ] ⚙️ **Settings Page** (notification time, check frequency, theme)
- [ ] 🌞 **Light Theme** option

**Medium Priority:**
- [ ] 📈 **Activity Feed** - See recent friend submissions
- [ ] 🎯 **Problem Recommendations** - "Popular among your friends"
- [ ] 🏅 **Badges Display** - Show LeetCode badges (Knight, Guardian, etc.)
- [ ] 📊 **Progress Bars** - Visual representation of stats
- [ ] ⌨️ **Keyboard Shortcuts** - Quick actions (Ctrl+F for search, etc.)

**Low Priority/Nice to Have:**
- [ ] 🖼️ **Profile Pictures** - Fetch and display avatars
- [ ] 🔔 **Milestone Notifications** - When friends hit 100, 500, 1000 problems
- [ ] 📅 **Calendar View** - Streak visualization
- [ ] 💬 **Notes** - Add personal notes to friends
- [ ] 🌐 **Multi-language** support
- [ ] 📱 **Mobile Support** (if LeetCode API allows)

### 🐞 Bug Reports

Found a bug? [Open an issue](https://github.com/yourusername/leetcode-friends-extension/issues/new) with:

**Required Information:**
- **Browser:** Chrome version (e.g., Chrome 120.0.6099.109)
- **Extension Version:** Found in `manifest.json` or `chrome://extensions/`
- **Operating System:** Windows/Mac/Linux + version
- **Steps to Reproduce:** Numbered list of exact steps
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happened
- **Screenshots:** If applicable
- **Console Errors:** F12 → Console tab → Copy any red errors

**Template:**
```markdown
**Bug Description:** Brief summary

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected:** It should do X
**Actual:** It does Y instead

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Extension: v2.0

**Screenshots:** [Attach here]
**Console Errors:** [Paste here]
```

### 📝 Code Style Guidelines

- Use **camelCase** for variables and functions
- Use **descriptive names**: `getUserStats()` not `getUS()`
- Add **comments** for complex logic
- Keep **functions small** (under 50 lines when possible)
- Use **async/await** over promises when possible
- Follow **existing formatting** (2 spaces, semicolons, etc.)

---

## 📊 Tech Stack & Architecture

### Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **Manifest V3** | Chrome extension standard | Latest |
| **Vanilla JavaScript** | Core logic (ES6+) | - |
| **CSS3** | Styling & animations | - |
| **Chrome APIs** | Storage, Alarms, Notifications | - |
| **LeetCode GraphQL** | Data fetching | - |

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              User Interface Layer               │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐│
│  │ popup.html│→ │popup.css │→ │  popup.js    ││
│  └───────────┘  └──────────┘  └──────────────┘│
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│             Content Script Layer                │
│  ┌───────────┐  ┌──────────┐                   │
│  │content.js │→ │ style.css│                   │
│  └───────────┘  └──────────┘                   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            Background Service Worker            │
│  ┌──────────────┐                               │
│  │background.js │ (Alarms, Notifications)       │
│  └──────────────┘                               │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│               Storage & APIs                    │
│  ┌──────────────┐  ┌─────────────────┐        │
│  │Chrome Storage│  │LeetCode GraphQL │        │
│  └──────────────┘  └─────────────────┘        │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Content Script detects profile
2. **Button Click** → Saves to Chrome Storage
3. **Popup Open** → Fetches from Storage + GraphQL API
4. **Background Worker** → Periodically checks streak
5. **Notification** → Displays if no submission today

---

## 🔐 Privacy & Security

### Data Collection

**We collect ZERO data. Period.**

- ✅ All data stored locally in Chrome Storage
- ✅ No external servers or databases
- ✅ No analytics or tracking
- ✅ No personal information collected
- ✅ Open source - verify the code yourself

### Permissions Justification

| Permission | Why | What We Do | What We Don't Do |
|------------|-----|------------|------------------|
| `storage` | Save friends | Store usernames locally | Upload to servers |
| `alarms` | Schedule checks | Check streak status | Track browsing |
| `notifications` | Reminders | Show streak alerts | Send spam |
| `host_permissions` | API access | Fetch LeetCode stats | Access other sites |

### Third-Party Services

**LeetCode GraphQL API** (Official)
- Used for: Fetching problem counts and submissions
- Data sent: Username (you provide)
- Data received: Public profile stats
- Privacy: Only accesses public data

---

## 📜 Version History

### v2.0.0 (Current) - November 2025

**🎉 Major Update - Feature Complete**

**New Features:**
- ✨ Personal dashboard with your own stats
- ✨ Competitive leaderboard with rankings
- ✨ Streak reminder system (red dot + badge + notifications)
- ✨ Drag-and-drop friend reordering
- ✨ Refresh button with spinning animation
- ✨ Background service worker for auto-checks

**UI Improvements:**
- 🎨 Complete dark theme redesign
- 🎨 Color-coded difficulty stats
- 🎨 Skeleton loaders with pulsing animation
- 🎨 Smooth hover effects and transitions
- 🎨 Monospace font for stats

**Technical:**
- ⚡ Upgraded to Manifest V3
- ⚡ GraphQL API integration
- ⚡ Chrome Alarms API for scheduling
- ⚡ Improved error handling
- ⚡ Better SPA navigation support

**Bug Fixes:**
- 🐛 Fixed button positioning on profile pages
- 🐛 Fixed CSS injection affecting LeetCode layout
- 🐛 Fixed extension context invalidation errors
- 🐛 Fixed stats not loading for some users

### v1.0.0 - October 2025

**Initial Release**

- ➕ Add/remove friends functionality
- 📊 Basic stats display (Total, Easy, Medium, Hard)
- ☁️ Chrome sync support
- 🎨 Simple popup interface
- 🔗 Direct profile links

---

## 💖 Support the Project

If you find this extension helpful, please consider:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** and suggest features via Issues
- 🤝 **Contribute code** via Pull Requests
- 📣 **Share** with fellow LeetCoders
- ☕ **Buy me a coffee** (link coming soon)
- 📝 **Write a review** (when on Chrome Web Store)

---

## 🌟 Acknowledgments

**Inspired by:**
- The LeetCode community's need for better social features
- Competitive programmers who track friend progress manually
- Developers who wanted Chrome sync for their friend lists

**Built with:**
- ❤️ Love for coding and problem-solving
- 🧠 Many late-night debugging sessions
- ☕ An unreasonable amount of coffee
- 🎵 Lo-fi beats to code to

**Special thanks to:**
- LeetCode for the amazing platform
- Chrome Extensions team for Manifest V3 docs
- The open-source community for inspiration
- Early testers who reported bugs

---

## 🔗 Links

- 📦 [Chrome Web Store](https://chrome.google.com/webstore) (Coming Soon)
- 🐛 [Report Bugs](https://github.com/Aditya-J07/leetcode-friend-list/issues)
- 💡 [Request Features](https://github.com/Aditya-J07/leetcode-friend-list/issues/new?labels=enhancement)
- 📖 [Documentation](https://github.com/Aditya-J07/leetcode-friend-list/wiki)
- 💬 [Discussions](https://github.com/Aditya-J07/leetcode-friend-list/discussions)
- 🔄 [Changelog](https://github.com/Aditya-J07/leetcode-friend-list/releases)

---

<div align="center">

## 🎯 Keep Coding, Stay Connected!

**Made with ❤️ for the LeetCode community**

*Because solving problems is better with friends!*

[⬆ Back to Top](#-leetcode-friends---your-coding-companion)

---

**Found this helpful? Give it a ⭐!**

</div>
