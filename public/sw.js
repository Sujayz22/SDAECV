// Service Worker for SDA English Church Vellore Web Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'SDA English Church, Vellore', body: event.data.text() };
    }
  }

  const title = data.title || 'SDA English Church, Vellore';
  const options = {
    body: data.body || 'New announcement or event published.',
    icon: data.icon || '/logo.png',
    badge: '/logo.png',
    image: data.image || undefined,
    data: {
      url: data.url || '/',
    },
    vibrate: [150, 50, 100],
    tag: data.tag || 'sdaecv-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
