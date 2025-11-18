document.addEventListener('DOMContentLoaded', () => {
  loadFriends();
});

function loadFriends() {
  chrome.storage.sync.get(['friends'], (result) => {
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
    
    friends.forEach((username) => {
      const friendItem = document.createElement('div');
      friendItem.className = 'friend-item';
      
      const link = document.createElement('a');
      link.href = `https://leetcode.com/u/${username}/`;
      link.target = '_blank';
      link.textContent = username;
      link.className = 'friend-link';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '❌';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => removeFriend(username));
      
      friendItem.appendChild(link);
      friendItem.appendChild(deleteBtn);
      friendsList.appendChild(friendItem);
    });
  });
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
