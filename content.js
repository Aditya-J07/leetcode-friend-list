// Check if extension context is valid
function isExtensionValid() {
  try {
    return chrome.runtime && chrome.runtime.id;
  } catch (e) {
    return false;
  }
}

// Wait for page to load and inject button
function init() {
  if (!isExtensionValid()) {
    console.log('LeetCode Friends: Extension context invalidated, please refresh page');
    return;
  }

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
  if (!isExtensionValid()) {
    console.log('LeetCode Friends: Extension context invalidated');
    return;
  }

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
  if (!isExtensionValid()) {
    console.log('LeetCode Friends: Extension context invalidated');
    button.textContent = '🔄 Refresh Page';
    button.style.cursor = 'pointer';
    button.onclick = () => location.reload();
    return;
  }

  try {
    chrome.storage.sync.get(['friends'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('LeetCode Friends: Storage error', chrome.runtime.lastError);
        return;
      }
      
      const friends = result.friends || [];
      console.log('LeetCode Friends: Current friends list:', friends);
      if (friends.includes(username)) {
        button.textContent = '✓ Added';
        button.classList.add('added');
        console.log('LeetCode Friends: User already in friends list');
      }
    });
  } catch (error) {
    console.error('LeetCode Friends: Error checking friend status', error);
  }
}

function addFriend(username, button) {
  if (!isExtensionValid()) {
    console.log('LeetCode Friends: Extension context invalidated');
    button.textContent = '🔄 Refresh Page';
    button.onclick = () => location.reload();
    return;
  }

  console.log('LeetCode Friends: Adding friend', username);
  
  try {
    chrome.storage.sync.get(['friends'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('LeetCode Friends: Storage error', chrome.runtime.lastError);
        button.textContent = '❌ Error';
        return;
      }

      const friends = result.friends || [];
      
      if (friends.includes(username)) {
        button.textContent = '✓ Already Added';
        console.log('LeetCode Friends: Friend already exists');
        return;
      }
      
      friends.push(username);
      chrome.storage.sync.set({ friends }, () => {
        if (chrome.runtime.lastError) {
          console.error('LeetCode Friends: Save error', chrome.runtime.lastError);
          button.textContent = '❌ Error';
          return;
        }

        console.log('LeetCode Friends: Saved friends list:', friends);
        button.textContent = '✓ Added';
        button.classList.add('added');
        
        // Show success message
        setTimeout(() => {
          button.textContent = '✓ Friend Added';
        }, 300);
      });
    });
  } catch (error) {
    console.error('LeetCode Friends: Error adding friend', error);
    button.textContent = '❌ Error';
  }
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
  if (!isExtensionValid()) return;
  
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('LeetCode Friends: URL changed to', url);
    setTimeout(init, 1000);
  }
}).observe(document, { subtree: true, childList: true });

console.log('LeetCode Friends: Content script loaded');
