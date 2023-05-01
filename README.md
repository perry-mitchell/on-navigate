# On-Navigate
> Navigation listener for standard webpages and SPAs

Web-only navigation "event" listener, primarily designed for SPAs (Single Page Applications). Use it to listen for navigation events.

## About

Listening for navigation events is a useful technique in detecting a change of context, such as with form submissions. Form submissions on SPAs are usually done in the background, but the URL will most likely still change. This library can be used in conjuction with a watched `<form>` to handle the capturing of a complete form.

### Why not use another similar library?

There were a couple of similar libraries in existence when I created this one, but I needed something more specific and standalone.

 * [`detect-url-change`](https://github.com/tariibaba/detect-url-change-js): Too basic; uses only a timer. `on-navigate` watches for events as well. Requires an event emitter.
 * [`on-url-change`](https://github.com/KoryNunn/on-url-change/blob/master/index.js): Same as above; uses only a timer. Requires an event emitter.
 * [`url-change-event`](https://github.com/jerrykingxyz/url-change-event): Probably the best equipped so far, but requires classes. Emits global events. Bit overkill for what I needed.

At the time of authoring, each of these libraries were CJS and not ESM, like this library.

## Installation

Run `npm install on-navigate --save-dev` to save as a dev dependency, as it will most likely be included in a bundle.

## Usage

On-Navigate supports 3 different methods to detect navigation changes, and they can be used interchangeably or all at the same time:

 * `NavigationMethod.Timer`: Use an interval timer to watch for URL changes.
 * `NavigationMethod.Popstate`: Listen for a history popstate event.
 * `NavigationMethod.BeforeUnload`: Listen for window-unload events. Least reliable due to _actual_ navigation.

By default all methods are enabled, with the timer interval set at `1000` ms.

```typescript
import { NavigationMethod, onNavigate } from "on-navigate";

onNavigate(() => {
    console.log("Navigation!");
});
```

You can also heavily customise the operation:

```typescript
onNavigate(
    () => {
        console.log("Navigation!");
    },
    {
        methods: [NavigationMethod.Timer],
        timerInterval: 100,
        urlGetter: () => window.location.href.toString(),
        windowGetter: () => ({
            addEventListener: () => {},
            removeEventListener: () => {}
        })
    }
);
```
