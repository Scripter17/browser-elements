# Browser Elements

## How to use

### Initializing

Link to the script with `<script src="broswerElements.js></script>"`, then call `browserElements.main()`. This will set the appropriate styling for all elements with `if-chrome`, `if-ie`, `id-edge`, `if-firefox`, and/or `if-opera` attributes.

### if-attributes

There are 5 default "if-attributes", `if-chrome`, `if-ie`, `id-edge`, `if-firefox`, and `if-opera`.\
These tell the script what browsers/versions to display an element in. For example, `<p if-chrome>This will only appear in Google Chrome</p>`.

Some more examples are below.

```html
<p if-firefox if-chrome>You are using either FireFox or Google Chrome.</p>
<p if-chrome="-60">You are using Google Chrome version 60 or below.</p>
<p if-chrome="65-65">You are using Google Chrome version 65.</p>
<p if-chrome="70-">You are using Google Chrome version 70 or above.</p>
```

The values of if-attributes are either an empty string or a range in the format `min-max`, where `min` and `max` are either numbers, or blank.\
If `max` is blank (i.e:`70-`), then it'll be "every version above `min`"\
If `min` is blank (i.e:`-70`), then it'll be "every version below `max`"

Right now, `min` and `max` only detect the browser's major version. So detecting the difference between `65.1` and `65.3` isn't possible right now. This will likely be added later.

### if-elements

"If-elements" are like if-attributes, except if its if-attributes are match the user's browser, then it'll be replaced with a duplicate of itself without the `if-` prefix.

Example:

```html
<if-script if-firefox>
	alert("You are using FireFox");
</if-script>
```

If the user is using FireFox, then that if-element will be replaced with a normal `script` element and run.

Any element can have the `if-` prefix, but its primary intended use is for `if-script` and `if-style` tags.