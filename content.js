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
  
  // Find the username heading at the top of the profile
  const targetSelectors = [
    'div.text-title-large.font-semibold', // Main username display
    'div[class*="text-title-large"]',
    'div.flex.items-center.gap-2 div[class*="font-semibold"]',
    'h1',
  ];
  
  let target = null;
  for (const selector of targetSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      // Check if this element contains the username and is near the top
      const rect = element.getBoundingClientRect();
      if (element.textContent.trim() === username && rect.top < 300) {
        target = element;
        console.log('LeetCode Friends: Found target element', selector, 'at position', rect.top);
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
  
  // Create button
  const button = document.createElement('button');
  button.id = 'leetcode-friend-btn';
  button.className = 'leetcode-friend-button';
  button.textContent = '➕ Add Friend';
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFriend(username, button);
  });
  
  // Find the parent container that holds the username
  let container = target.parentElement;
  
  // Insert button right after the username in the same container
  if (container && container.classList.contains('flex')) {
    // If parent is a flex container, add button as sibling
    container.appendChild(button);
    console.log('LeetCode Friends: Button added to flex container');
  } else {
    // Otherwise create a wrapper
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '12px';
    
    target.parentNode.insertBefore(wrapper, target);
    wrapper.appendChild(target);
    wrapper.appendChild(button);
    console.log('LeetCode Friends: Button wrapped with username');
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
