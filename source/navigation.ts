export enum NavigationMethod {
    BeforeUnload = "beforeunload",
    Popstate = "popstate",
    Timer = "timer"
}

export interface OnNavigateOptions {
    methods?: Array<NavigationMethod>;
    timerInterval?: number;
    urlGetter?: () => string;
    windowGetter?: () => Window | WindowProxy;
}

export function onNavigate(
    callback: () => void,
    opts: OnNavigateOptions = {}
): {
    remove: () => void;
} {
    const {
        methods = Object.values(NavigationMethod),
        timerInterval = 1000,
        urlGetter = () => window.location.href.toString(),
        windowGetter = () => window
    } = opts;
    if (methods.length <= 0) {
        throw new Error("Invalid configuration: No navigation methods specified");
    }
    const win = windowGetter();
    let cleanup: () => void = () => {};
    // Check and execute callback
    let lastURL = urlGetter();
    const checkForNavigation = (force: boolean = false) => {
        const newURL = urlGetter();
        const urlDiffers = lastURL !== newURL;
        lastURL = newURL;
        if (urlDiffers || force) {
            callback();
        }
    };
    // Method 1: Timer
    if (methods.includes(NavigationMethod.Timer)) {
        const timer = setInterval(() => {
            checkForNavigation();
        }, timerInterval);
        const oldCleanup = cleanup;
        cleanup = () => {
            oldCleanup();
            clearInterval(timer);
        };
    }
    // Method 2: Popstate
    if (methods.includes(NavigationMethod.Popstate)) {
        const handlePopstate = () => {
            checkForNavigation();
        };
        win.addEventListener("popstate", handlePopstate);
        const oldCleanup = cleanup;
        cleanup = () => {
            oldCleanup();
            win.removeEventListener("popstate", handlePopstate);
        };
    }
    // Method 3: beforeunload
    if (methods.includes(NavigationMethod.BeforeUnload)) {
        const handleBeforeUnload = () => {
            checkForNavigation(true);
        };
        win.addEventListener("beforeunload", handleBeforeUnload);
        const oldCleanup = cleanup;
        cleanup = () => {
            oldCleanup();
            win.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }
    // Handler
    return {
        remove: () => {
            cleanup();
        }
    };
}
