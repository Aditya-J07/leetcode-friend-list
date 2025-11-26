// Check user's submission status periodically
chrome.alarms.create('checkStreak', {
  periodInMinutes: 30 // Check every 30 minutes
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkStreak') {
    await checkUserStreak();
  }
});

// Check on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode Friends: Extension installed/updated');
  checkUserStreak();
});

// Check when browser starts
chrome.runtime.onStartup.addListener(() => {
  console.log('LeetCode Friends: Browser started');
  checkUserStreak();
});

async function checkUserStreak() {
  chrome.storage.sync.get(['myUsername', 'lastNotificationDate'], async (result) => {
    const myUsername = result.myUsername;
    
    if (!myUsername) {
      // Clear badge if no username set
      chrome.action.setBadgeText({ text: '' });
      return;
    }
    
    const today = new Date().toDateString();
    const lastNotified = result.lastNotificationDate;
    
    // Check if user submitted today
    const hasSubmittedToday = await checkTodaySubmission(myUsername);
    
    if (!hasSubmittedToday) {
      // Set red badge
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4743' });
      chrome.action.setTitle({ title: 'LeetCode Friends - Solve a problem today!' });
      
      // Send notification once per day after 8 PM
      const currentHour = new Date().getHours();
      if (lastNotified !== today && currentHour >= 20) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23ef4743"/></svg>',
          title: '🔥 LeetCode Streak Reminder',
          message: `Hey ${myUsername}! You haven't solved any problems today. Keep your streak alive! 💪`,
          priority: 2
        });
        
        // Update last notification date
        chrome.storage.sync.set({ lastNotificationDate: today });
      }
    } else {
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

console.log('LeetCode Friends: Background service worker loaded');