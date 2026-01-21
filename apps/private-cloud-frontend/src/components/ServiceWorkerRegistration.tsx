"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
            console.log("Service Workers are not supported");
            return;
        }

        // Register service worker
        navigator.serviceWorker
            .register("/sw.js", { scope: "/" })
            .then((registration) => {
                console.log(
                    "Service Worker registered successfully:",
                    registration
                );

                // Check for updates periodically
                const updateInterval = setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute

                // Listen for new service worker
                const handleUpdateFound = () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        const handleStateChange = () => {
                            if (newWorker.state === "activated") {
                                console.log("New Service Worker activated");
                                // Notify user that update is available
                                if (
                                    window.confirm(
                                        "A new version is available. Reload to update?"
                                    )
                                ) {
                                    window.location.reload();
                                }
                            }
                        };
                        newWorker.addEventListener(
                            "statechange",
                            handleStateChange
                        );
                    }
                };

                registration.addEventListener("updatefound", handleUpdateFound);

                // Cleanup on component unmount
                return () => {
                    clearInterval(updateInterval);
                    registration.removeEventListener(
                        "updatefound",
                        handleUpdateFound
                    );
                };
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });

        // Listen for install prompt
        // Note: deferredPrompt could be used to show a custom install button
        // For now, we let the browser show the install UI automatically

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            // Store the event for potential custom install button later
            // const deferredPrompt = e as BeforeInstallPromptEvent;
            console.log("Install prompt ready");
        };

        const handleAppInstalled = () => {
            console.log("PWA was installed");
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        // Cleanup
        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    return null;
}
