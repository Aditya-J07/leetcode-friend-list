let draggedItem = null;
let isReorderMode = false;

document.addEventListener('DOMContentLoaded', () => {
  initializeUser();
  loadFriends();
  setupEventListeners();
  checkUserStreak(); // Check streak on popup open
});

function setupEventListeners() {
  document.getElementById('save-username-btn').addEventListener('click', saveUsername);
  document.getElementById('edit-username-btn').addEventListener('click', editUsername);
  document.getElementById('refresh-btn').addEventListener('click', refreshStats);
  document.getElementById('compare-btn').addEventListener('click', showComparison);
  document.getElementById('reorder-btn').addEventListener('click', toggleReorderMode);
  document.getElementById('close-comparison').addEventListener('click', closeComparison);
  
  // Enter key to save username
  document.getElementById('username-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveUsername();
  });
}

function initializeUser() {
  chrome.storage.sync.get(['myUsername'], (result) => {
    if (result.myUsername) {
      showUserProfile(result.myUsername);
    } else {
      showUserSetup();
    }
  });
}

function showUserSetup() {
  document.getElementById('user-setup').style.display = 'block';
  document.getElementById('user-profile').style.display = 'none';
}

function showUserProfile(username) {
  document.getElementById('user-setup').style.display = 'none';
  document.getElementById('user-profile').style.display = 'block';
  
  const userLink = document.getElementById('user-link');
  userLink.textContent = username;
  userLink.href = `https://leetcode.com/u/${username}/`;
  
  loadUserStats(username);
}

async function loadUserStats(username) {
  const stats = await getUserStats(username);
  const statsDiv = document.getElementById('user-stats');
  
  if (stats) {
    statsDiv.innerHTML = `
      <span class="stat-number total">${stats.totalSolved}</span>
      <span class="stat-number easy">${stats.easy}</span>
      <span class="stat-number medium">${stats.medium}</span>
      <span class="stat-number hard">${stats.hard}</span>
    `;
  } else {
    statsDiv.innerHTML = `
      <span class="stat-number error total">?</span>
      <span class="stat-number error easy">?</span>
      <span class="stat-number error medium">?</span>
      <span class="stat-number error hard">?</span>
    `;
  }
}

function saveUsername() {
  const username = document.getElementById('username-input').value.trim();
  
  if (!username) {
    alert('Please enter a valid username');
    return;
  }
  
  chrome.storage.sync.set({ myUsername: username }, () => {
    showUserProfile(username);
    checkUserStreak(); // Check streak after setting username
  });
}

function editUsername() {
  document.getElementById('username-input').value = '';
  showUserSetup();
}

// Refresh button functionality
async function refreshStats() {
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.classList.add('spinning');
  
  // Reload user stats
  chrome.storage.sync.get(['myUsername'], async (result) => {
    if (result.myUsername) {
      await loadUserStats(result.myUsername);
    }
  });
  
  // Reload friends
  await loadFriends();
  
  // Check streak again
  await checkUserStreak();
  
  setTimeout(() => {
    refreshBtn.classList.remove('spinning');
  }, 500);
}

// Check if user submitted today
// Check if user submitted today
async function checkUserStreak() {
  chrome.storage.sync.get(['myUsername'], async (result) => {
    const myUsername = result.myUsername;
    
    if (!myUsername) return;
    
    const hasSubmittedToday = await checkTodaySubmission(myUsername);
    const streakIndicator = document.getElementById('streak-indicator');
    
    if (!hasSubmittedToday) {
      // Show red dot in popup
      streakIndicator.style.display = 'flex';
      streakIndicator.title = '⚠️ You haven\'t solved any problems today! Keep your streak alive!';
      
      // Set badge on extension icon
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4743' });
      chrome.action.setTitle({ title: 'LeetCode Friends - Solve a problem today!' });
    } else {
      // Hide red dot
      streakIndicator.style.display = 'none';
      
      // Clear badge
      chrome.action.setBadgeText({ text: '' });
      chrome.action.setTitle({ title: 'LeetCode Friends' });
    }
  });
}

async function checkTodaySubmission(username) {
  try {
    const query = `
      query recentAcSubmissions($username: String!) {
        recentAcSubmissionList(username: $username, limit: 10) {
          timestamp
        }
      }
    `;
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query,
        variables: { username: username }
      })
    });
    
    const data = await response.json();
    
    if (data.data && data.data.recentAcSubmissionList) {
      const submissions = data.data.recentAcSubmissionList;
      const todayStart = new Date().setHours(0, 0, 0, 0) / 1000;
      
      return submissions.some(sub => parseInt(sub.timestamp) >= todayStart);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking submissions:', error);
    return false;
  }
}

async function getUserStats(username) {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { username: username }
      })
    });
    
    const data = await response.json();
    
    if (data.data && data.data.matchedUser) {
      const stats = data.data.matchedUser.submitStats.acSubmissionNum;
      const totalSolved = stats.find(item => item.difficulty === 'All')?.count || 0;
      const easy = stats.find(item => item.difficulty === 'Easy')?.count || 0;
      const medium = stats.find(item => item.difficulty === 'Medium')?.count || 0;
      const hard = stats.find(item => item.difficulty === 'Hard')?.count || 0;
      
      return { totalSolved, easy, medium, hard };
    }
    return null;
  } catch (error) {
    console.error('Error fetching stats for', username, error);
    return null;
  }
}

async function loadFriends() {
  chrome.storage.sync.get(['friends'], async (result) => {
    const friends = result.friends || [];
    const friendsList = document.getElementById('friends-list');
    const emptyState = document.getElementById('empty-state');
    
    friendsList.innerHTML = '';
    
    if (friends.length === 0) {
      emptyState.style.display = 'block';
      friendsList.style.display = 'none';
      return;
    }
    
    emptyState.style.display = 'none';
    friendsList.style.display = 'block';
    
    // Show skeleton loaders with dashes
    for (const username of friends) {
      const friendItem = createFriendItem(username, 'loading');
      friendsList.appendChild(friendItem);
    }
    
    // Fetch stats for each friend
    for (const username of friends) {
      const stats = await getUserStats(username);
      const existingItem = document.querySelector(`[data-username="${username}"]`);
      if (existingItem) {
        const newItem = createFriendItem(username, stats);
        existingItem.replaceWith(newItem);
      }
    }
  });
}

function createFriendItem(username, stats) {
  const friendItem = document.createElement('div');
  friendItem.className = 'friend-item';
  friendItem.setAttribute('data-username', username);
  friendItem.setAttribute('draggable', 'false');
  
  const leftSection = document.createElement('div');
  leftSection.className = 'friend-info';
  
  const link = document.createElement('a');
  link.href = `https://leetcode.com/u/${username}/`;
  link.target = '_blank';
  link.textContent = username;
  link.className = 'friend-link';
  
  leftSection.appendChild(link);
  
  if (stats === 'loading') {
    const statsDiv = document.createElement('div');
    statsDiv.className = 'friend-stats skeleton';
    statsDiv.innerHTML = `
      <span class="stat-number skeleton-dash total">-</span>
      <span class="stat-number skeleton-dash easy">-</span>
      <span class="stat-number skeleton-dash medium">-</span>
      <span class="stat-number skeleton-dash hard">-</span>
    `;
    leftSection.appendChild(statsDiv);
  } else if (stats) {
    const statsDiv = document.createElement('div');
    statsDiv.className = 'friend-stats';
    statsDiv.innerHTML = `
      <span class="stat-number total">${stats.totalSolved}</span>
      <span class="stat-number easy">${stats.easy}</span>
      <span class="stat-number medium">${stats.medium}</span>
      <span class="stat-number hard">${stats.hard}</span>
    `;
    leftSection.appendChild(statsDiv);
    
    // Store stats for comparison
    friendItem.dataset.stats = JSON.stringify(stats);
  } else {
    const statsDiv = document.createElement('div');
    statsDiv.className = 'friend-stats';
    statsDiv.innerHTML = `
      <span class="stat-number error total">?</span>
      <span class="stat-number error easy">?</span>
      <span class="stat-number error medium">?</span>
      <span class="stat-number error hard">?</span>
    `;
    leftSection.appendChild(statsDiv);
  }
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => removeFriend(username));
  
  friendItem.appendChild(leftSection);
  friendItem.appendChild(deleteBtn);
  
  return friendItem;
}

function toggleReorderMode() {
  isReorderMode = !isReorderMode;
  const reorderBtn = document.getElementById('reorder-btn');
  const friendItems = document.querySelectorAll('.friend-item');
  
  if (isReorderMode) {
    reorderBtn.textContent = '✓';
    reorderBtn.classList.add('active');
    
    friendItems.forEach(item => {
      item.setAttribute('draggable', 'true');
      item.classList.add('draggable');
      
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
    });
  } else {
    reorderBtn.textContent = '↕️';
    reorderBtn.classList.remove('active');
    
    friendItems.forEach(item => {
      item.setAttribute('draggable', 'false');
      item.classList.remove('draggable');
      
      item.removeEventListener('dragstart', handleDragStart);
      item.removeEventListener('dragover', handleDragOver);
      item.removeEventListener('drop', handleDrop);
      item.removeEventListener('dragend', handleDragEnd);
    });
    
    // Save new order
    saveFriendsOrder();
  }
}

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const afterElement = getDragAfterElement(document.getElementById('friends-list'), e.clientY);
  if (afterElement == null) {
    document.getElementById('friends-list').appendChild(draggedItem);
  } else {
    document.getElementById('friends-list').insertBefore(draggedItem, afterElement);
  }
}

function handleDrop(e) {
  e.stopPropagation();
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.friend-item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveFriendsOrder() {
  const friendItems = document.querySelectorAll('.friend-item');
  const newOrder = Array.from(friendItems).map(item => item.dataset.username);
  
  chrome.storage.sync.set({ friends: newOrder }, () => {
    console.log('Friends order saved:', newOrder);
  });
}

async function showComparison() {
  const modal = document.getElementById('comparison-modal');
  const content = document.getElementById('comparison-content');
  
  modal.style.display = 'flex';
  content.innerHTML = '<p class="loading">Loading comparison...</p>';
  
  chrome.storage.sync.get(['myUsername', 'friends'], async (result) => {
    const myUsername = result.myUsername;
    const friends = result.friends || [];
    
    if (!myUsername) {
      content.innerHTML = '<p class="error">Please set your username first!</p>';
      return;
    }
    
    const myStats = await getUserStats(myUsername);
    const allStats = [{ username: myUsername + ' (You)', stats: myStats, isMe: true }];
    
    for (const friend of friends) {
      const stats = await getUserStats(friend);
      allStats.push({ username: friend, stats: stats, isMe: false });
    }
    
    // Sort by total solved (descending)
    allStats.sort((a, b) => (b.stats?.totalSolved || 0) - (a.stats?.totalSolved || 0));
    
    let html = '<div class="comparison-list">';
    allStats.forEach((user, index) => {
      const rank = index + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
      
      html += `
        <div class="comparison-item ${user.isMe ? 'highlight' : ''}">
          <span class="rank">${medal}</span>
          <div class="comp-info">
            <span class="comp-name">${user.username}</span>
            <div class="comp-stats">
              <span class="stat-number total">${user.stats?.totalSolved || '?'}</span>
              <span class="stat-number easy">${user.stats?.easy || '?'}</span>
              <span class="stat-number medium">${user.stats?.medium || '?'}</span>
              <span class="stat-number hard">${user.stats?.hard || '?'}</span>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    
    content.innerHTML = html;
  });
}

function closeComparison() {
  document.getElementById('comparison-modal').style.display = 'none';
}

function removeFriend(username) {
  chrome.storage.sync.get(['friends'], (result) => {
    let friends = result.friends || [];
    friends = friends.filter(f => f !== username);
    
    chrome.storage.sync.set({ friends }, () => {
      loadFriends();
    });
  });
}