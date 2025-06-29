// Minimal notification service placeholder

module.exports = {
  sendNotification: (to, message) => {
    // For now, just log the notification
    console.log(`[Notification] To: ${to}, Message: ${message}`);
    return Promise.resolve();
  }
}; 