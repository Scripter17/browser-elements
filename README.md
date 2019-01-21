# Browser Elements

Documentation can be found in [documentaion.md](documentation.md)

## How to use

### Initializing

Link to the script with `<script src="broswerElements.js></script>"`, then call `browserElements.main()`. This will set the appropriate styling for all elements with `if-chrome`, `if-ie`, `id-edge`, `if-firefox`, and/or `if-opera` attributes.

### if-attributes

There are 5 default "if-attributes", `if-chrome`, `if-ie`, `id-edge`, `if-firefox`, and `if-opera`.\
These tell the script what browsers/versions to display an element in. For example, `<p if-chrome>This will only appear in Google Chrome</p>`.

Some more examples are below.

```html
<p if-firefox if-chrome>You are using either FireFox or Google Chrome.</p>
<p if-firefox="-60">You are using FireFox version 60 or below.</p>
<p if-firefox="55-55">You are using FireFox version 55.</p>
<p if-firefox="60-">You are using FireFox version 60 or above.</p>
<p if-ie="6-6">You are dead to me.</p>
```

The values of if-attributes are either an empty string or a range in the format `min-max`, where `min` and `max` are either numbers, or blank.\
If `max` is blank (i.e:`70-`), then it'll be "every version above `min`"\
If `min` is blank (i.e:`-70`), then it'll be "every version below `max`"

Right now, `min` and `max` only detect the browser's major version. So detecting the difference between `65.1` and `65.3` isn't possible right now. This will likely be added later.

### if-elements

"If-elements" are like if-attributes, except if its if-attributes are match the user's browser, then it'll be replaced with a duplicate of itself without the `if-` prefix.

Examples:

```html
<if-script if-firefox>
	alert("You are using FireFox");
</if-script>
```

```html
<if-script if-ie>
	window.location.href="https://www.mozilla.org/en-CA/firefox/new/";
</if-script>
```

If the user is using the appropriate browser, then that if-element will be replaced with a normal `script` element and run.

Any element can have the `if-` prefix, but its primary intended use is for `if-script` and `if-style` tags.

Perhaps the most practical use of if-elements is using `if-style` to solve browser-compatibility issues without writing a bunch of spaghetti code.

## Compatibility

As of my last test, this script has been confirmed to work on FireFox 2+, IE 6+, all versions of Edge, Chrome 10+, and Opera 10+.

Any other browsers are unsupported as of me writing this, but support *can* be added.

### Adding additional browser checks

To add a new browser to the script, you must do three things:

1. Add a new property to the `browserElements.getFuncs` object with a string key representing the browser's name ("ie", "firefox", etc.), and a function value that takes an optional userAgent string (should default to `navigator.userAgent`), and returns `true` if the UA is from the browser, and `false` otherwise.

2. Add said key to the `broswerElements.types` Array.

3. Add a new element to `browserElements.getVersion` with the key same key and a function that takes an optional userAgent string and returns the browser's major version for that userAgent.

If this is done correctly, and `browserElements.main()` is called again, the script should detect `if-newBrowser` as a valid if-attribute.