const CACHE_NAME = "mfg-v1";

// Clean up old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
});

// Cache-on-fetch strategy for app shell
self.addEventListener("fetch", (event) => {
  // Skip non-GET and cross-origin requests
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Skip API and auth routes
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cache.match(event.request))
    )
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  let data = { title: "My Family Genius", body: "You have a chore to do!" };
  try {
    data = event.data.json();
  } catch {
    // Use default
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: data.tag || "chore-reminder",
      data: { url: data.url || "/chores" },
    })
  );
});

// Open app on notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/chores";
  const fullUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus().then((focusedClient) => {
            // Try navigate() first (works on Chrome/Android)
            if (focusedClient && "navigate" in focusedClient) {
              return focusedClient.navigate(fullUrl);
            }
            // Fallback for iOS: postMessage to tell the app to navigate
            if (focusedClient) {
              focusedClient.postMessage({ type: "navigate", url: fullUrl });
            }
            return focusedClient;
          });
        }
      }
      return self.clients.openWindow(fullUrl);
    })
  );
});
