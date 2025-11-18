document.addEventListener('DOMContentLoaded', () => {
  loadFriends();
});

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
  
  const leftSection = document.createElement('div');
  leftSection.className = 'friend-info';
  
  const link = document.createElement('a');
  link.href = `https://leetcode.com/u/${username}/`;
  link.target = '_blank';
  link.textContent = username;
  link.className = 'friend-link';
  
  leftSection.appendChild(link);
  
  if (stats === 'loading') {
    // Skeleton loader with dashes
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
    // Show real stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'friend-stats';
    statsDiv.innerHTML = `
      <span class="stat-number total">${stats.totalSolved}</span>
      <span class="stat-number easy">${stats.easy}</span>
      <span class="stat-number medium">${stats.medium}</span>
      <span class="stat-number hard">${stats.hard}</span>
    `;
    leftSection.appendChild(statsDiv);
  } else {
    // Error state
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

function removeFriend(username) {
  chrome.storage.sync.get(['friends'], (result) => {
    let friends = result.friends || [];
    friends = friends.filter(f => f !== username);
    
    chrome.storage.sync.set({ friends }, () => {
      loadFriends();
    });
  });
}
