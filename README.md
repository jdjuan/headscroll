# Headscroll

## Roadmap

1. Make it a library so websites can embed the functionality by default
2. Allow other people to contribute to the model to make it more accurate
3. Store in localhost the settings defined

## Known Issues

1. In mobile, touch scrolling doesn't work on certain websites. By wrapping an iframe on a div, we have to make the iframe height sufficiently high so that wrapping div displays it correctly. But by doing so, some websites might stop working properly on mobile devices when the user attempts a touch scroll.