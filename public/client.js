const publicVapidKey = "BPLjP5S57gt-RFgCXoSYSB7N_CtXAhwQhZLrUgRJVBVXdVOOSRCbEi2EmgP3UjGsNb_qJsn-FgzXQI6wL--BMbY";

if ("serviceWorker" in navigator) {
    send().catch(err => console.error(err));
}
async function send() {
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    await fetch("http://localhost:3001/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        },
    });
}
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}