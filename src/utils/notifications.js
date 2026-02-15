export const addNotification = (userId, type, title, message, status) => {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  const newNotification = {
    id: Date.now(),
    userId,
    type,
    title,
    message,
    status,
    read: false,
    timestamp: new Date().toISOString()
  };

  notifications.unshift(newNotification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  return newNotification;
};