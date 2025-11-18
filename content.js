// Wait for page to load and inject button
function init() {
  const url = window.location.href;
  
  // Match both old and new LeetCode profile URL patterns
  const match = url.match(/leetcode\.com\/u\/([^\/]+)\/?/) || 
                url.match(/leetcode\.com\/([^\/]+)\/?\??(tab=)?/);
  
  if (match && match[1]) {
    const username = match[1];
    // Ignore non-profile pages
    if (['problems', 'problemset', 'explore', 'discuss', 'contest', 'interview'].includes(username)) {
      return;
    }
    console.log('LeetCode Friends: Detected profile for', username);
    injectButton(username);
  }
}

function injectButton(username) {
  // Check if button already exists
  if (document.getElementById('leetcode-friend-btn')) {
    console.log('LeetCode Friends: Button already exists');
    return;
  }
  
  console.log('LeetCode Friends: Attempting to inject button');
  
  // Try multiple selectors for different page layouts
  const targetSelectors = [
    'div[class*="text-title-large"]', // New LeetCode layout
    'div[class*="font-semibold text-"]',
    '.text-label-1',
    '[class*="username"]',
    'div.flex.items-center h1',
    'h1',
    '.profile-username'
  ];
  
  let target = null;
  for (const selector of targetSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      if (element.textContent.trim() === username || 
          element.textContent.includes(username)) {
        target = element;
        console.log('LeetCode Friends: Found target element', selector);
        break;
      }
    }
    if (target) break;
  }
  
  if (!target) {
    console.log('LeetCode Friends: No target found, retrying...');
    setTimeout(() => injectButton(username), 1000);
    return;
  }
  
  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'inline-block';
  buttonContainer.style.marginLeft = '12px';
  
  const button = document.createElement('button');
  button.id = 'leetcode-friend-btn';
  button.className = 'leetcode-friend-button';
  button.textContent = '➕ Add Friend';
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFriend(username, button);
  });
  
  buttonContainer.appendChild(button);
  
  // Insert button after target or in parent
  if (target.parentNode) {
    target.parentNode.insertBefore(buttonContainer, target.nextSibling);
    console.log('LeetCode Friends: Button injected successfully');
  } else {
    target.after(buttonContainer);
    console.log('LeetCode Friends: Button injected using after()');
  }
  
  // Check if already added
  checkIfFriend(username, button);
}

function checkIfFriend(username, button) {
  chrome.storage.sync.get(['friends'], (result) => {
    const friends = result.friends || [];
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
      button.textContent = '✓ Added';
      button.classList.add('added');
      console.log('LeetCode Friends: Friend added successfully');
      setTimeout(() => {
        button.textContent = '✓ Friend Added';
      }, 500);
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 500);
}

// Watch for navigation changes (SPA)
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
