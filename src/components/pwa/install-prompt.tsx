"use client";

import * as React from "react";
import { Download, X, Share, Plus, MoreVertical, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "simola-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [ios, setIos] = React.useState(false);

  React.useEffect(() => {
    if (isStandalone()) return;
    if (typeof localStorage !== "undefined" && localStorage.getItem(DISMISS_KEY)) return;

    const iosDevice = isIOS();
    setIos(iosDevice);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS never fires beforeinstallprompt — show the banner anyway.
    if (iosDevice) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setVisible(false);
      setDeferred(null);
    } else {
      setHelpOpen(true);
    }
  };

  return (
    <>
      {visible && (
        <div className="fixed bottom-4 left-4 right-20 z-40 sm:right-auto sm:max-w-sm animate-fade-in">
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Install the Simola app</p>
              <p className="truncate text-xs text-muted-foreground">Add to your home screen for quick access.</p>
            </div>
            <Button size="sm" onClick={install} className="shrink-0">
              <Download className="h-4 w-4" /> {ios ? "How" : "Install"}
            </Button>
            <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Home Screen</DialogTitle>
            <DialogDescription>Install Simola HOA to launch it like a normal app.</DialogDescription>
          </DialogHeader>
          <InstallInstructions />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function InstallInstructions() {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <p className="mb-2 flex items-center gap-2 font-semibold">
          <Share className="h-4 w-4 text-estate-gold" /> iPhone &amp; iPad (Safari)
        </p>
        <ol className="ml-5 list-decimal space-y-1 text-muted-foreground">
          <li>Tap the <strong>Share</strong> icon in the Safari toolbar.</li>
          <li>Scroll down and tap <strong>“Add to Home Screen”</strong>.</li>
          <li>Tap <strong>Add</strong> — the Simola icon appears on your home screen.</li>
        </ol>
      </div>
      <div>
        <p className="mb-2 flex items-center gap-2 font-semibold">
          <MoreVertical className="h-4 w-4 text-estate-gold" /> Android (Chrome)
        </p>
        <ol className="ml-5 list-decimal space-y-1 text-muted-foreground">
          <li>Tap the <strong>⋮</strong> menu in the top-right of Chrome.</li>
          <li>Tap <strong>“Install app”</strong> or <strong>“Add to Home screen”</strong>.</li>
          <li>Confirm with <strong>Install</strong> / <strong>Add</strong>.</li>
        </ol>
      </div>
      <p className="flex items-center gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
        <Plus className="h-4 w-4 shrink-0 text-estate-gold" />
        Once installed, open Simola from your home screen — it launches full-screen, just like a native app, and works offline for key information.
      </p>
    </div>
  );
}
