// Wait for page to load
function init() {
  const url = window.location.href;
  const match = url.match(/leetcode\.com\/u?\/?([\w-]+)\/?$/);
  
  if (match) {
    const username = match[1];
    injectButton(username);
  }
}

function injectButton(username) {
  // Check if button already exists
  if (document.getElementById('leetcode-friend-btn')) return;
  
  // Find a suitable place to inject the button
  const targetSelectors = [
    '.css-1xw5keg-UserName',
    '[class*="username"]',
    'h1',
    '.profile-username'
  ];
  
  let target = null;
  for (const selector of targetSelectors) {
    target = document.querySelector(selector);
    if (target) break;
  }
  
  if (!target) {
    // Retry after delay
    setTimeout(() => injectButton(username), 1000);
    return;
  }
  
  const button = document.createElement('button');
  button.id = 'leetcode-friend-btn';
  button.className = 'leetcode-friend-button';
  button.textContent = '➕ Add Friend';
  
  button.addEventListener('click', () => addFriend(username, button));
  
  // Insert button after target
  target.parentNode.insertBefore(button, target.nextSibling);
  
  // Check if already added
  checkIfFriend(username, button);
}

function checkIfFriend(username, button) {
  chrome.storage.sync.get(['friends'], (result) => {
    const friends = result.friends || [];
    if (friends.includes(username)) {
      button.textContent = '✓ Added';
      button.classList.add('added');
    }
  });
}

function addFriend(username, button) {
  chrome.storage.sync.get(['friends'], (result) => {
    const friends = result.friends || [];
    
    if (friends.includes(username)) {
      button.textContent = '✓ Already Added';
      return;
    }
    
    friends.push(username);
    chrome.storage.sync.set({ friends }, () => {
      button.textContent = '✓ Added';
      button.classList.add('added');
      setTimeout(() => {
        button.textContent = '✓ Friend Added';
      }, 500);
    });
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-check on URL change (for single-page app navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(init, 500);
  }
}).observe(document, { subtree: true, childList: true });
