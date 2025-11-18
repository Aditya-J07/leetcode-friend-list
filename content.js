// Wait for page to load and inject button
function init() {
  const url = window.location.href;
  
  // Match LeetCode profile URL patterns
  const match = url.match(/leetcode\.com\/u\/([^\/]+)\/?/);
  
  if (match && match[1]) {
    const username = match[1];
    console.log('LeetCode Friends: Detected profile for', username);
    
    // Wait a bit for page to fully load
    setTimeout(() => injectButton(username), 1500);
  }
}

function injectButton(username) {
  // Check if button already exists
  if (document.getElementById('leetcode-friend-btn')) {
    console.log('LeetCode Friends: Button already exists');
    return;
  }
  
  console.log('LeetCode Friends: Attempting to inject button for', username);
  
  // Create a floating button in the top-right corner instead
  const button = document.createElement('button');
  button.id = 'leetcode-friend-btn';
  button.className = 'leetcode-friend-button-fixed';
  button.textContent = '➕ Add Friend';
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFriend(username, button);
  });
  
  // Add to body (floating button)
  document.body.appendChild(button);
  console.log('LeetCode Friends: Button injected as floating button');
  
  // Check if already added
  checkIfFriend(username, button);
}

function checkIfFriend(username, button) {
  chrome.storage.sync.get(['friends'], (result) => {
    const friends = result.friends || [];
    console.log('LeetCode Friends: Current friends list:', friends);
    if (friends.includes(username)) {
      button.textContent = '✓ Added';
      button.classList.add('added');
      console.log('LeetCode Friends: User already in friends list');
    }
  });
}

function addFriend(username, button) {
  console.log('LeetCode Friends: Adding friend', username);
  chrome.storage.sync.get(['friends'], (result) => {
    const friends = result.friends || [];
    
    if (friends.includes(username)) {
      button.textContent = '✓ Already Added';
      console.log('LeetCode Friends: Friend already exists');
      return;
    }
    
    friends.push(username);
    chrome.storage.sync.set({ friends }, () => {
      console.log('LeetCode Friends: Saved friends list:', friends);
      button.textContent = '✓ Added';
      button.classList.add('added');
      
      // Show success message
      setTimeout(() => {
        button.textContent = '✓ Friend Added';
      }, 300);
    });
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Watch for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('LeetCode Friends: URL changed to', url);
    setTimeout(init, 1000);
  }
}).observe(document, { subtree: true, childList: true });

console.log('LeetCode Friends: Content script loaded');
