# HeadScroll

## References

- https://www.producthunt.com/
- https://www.shutterstock.com/licenses/image

- Put website url into a query param instead to avoid people seeing an error when they mistype headscroll's url
  - Requires to update bookmarks and routers
- Change bookmark anitmation (more shadow, bigger?)

### Scroller

1. It's time to enable to your camera [Camera]
   1. Add exception for cam blocked or not found
2. Tips for a better experience | [Don't_show_again] | [woman-tilting-head]
   1. Put your camera in front of you
   2. Avoid tilting your head unless you want to scroll
3. Our mobile experience is not ready at the moment, please use a laptop | [laptop_woman] 
   1. Let me see it, I won't judge!
   2. I will try later on another device
4. Is the website displayed correctly? | [yes-no]
5. Loading indicators
   1. Also for URL submit from landing
6. Layout, remove material
7. Make the default heigh larger for my screen
8. Options
   1. Hide / Show camera
   2. Speed
   3. Invert Scrolling
   4. Report website
   5. Body Points
9. Fix bug for https://www.cifraclub.com.br/shakira/te-espero-sentada/

### Backend

1. Store websites searched (both the URL and URI), and keep the count
2. Admin View to Blacklist and whitelist.
   1. https://twitter.com/cifraclub

### Buy me a coffee

1. Customize page

### SEO

1. OG and SEO Tags, Images for social media
2. Add Google Analytics
3. Buy domain
4. Add product hunt reference
5. Send email my personal subscription list
6. Tweet, tagging: https://twitter.com/ire_alva

### Test

1. Test in other browsers (remove <b> tags) and OS's, and devices
2. 

### Model

1. Test more and improve model

### Main

1. Button: Scroll a random song


## Roadmap

1. Invert scrolling [x]
1. Store favorite settings on localStorage
2. Prevent DoS attacks
3. Make it a library so websites can embedd the functionality by default
4. Allow other people to contribute to the model to make it more accurate

## Known Issues

1. In mobile, touch scrolling doesn't work on certain websites. By wrapping an iframe on a div, we have to make the iframe height sufficiently high so that wrapping div displays it correctly. But by doing so, some websites might stop working properly on mobile devices when the user attempts a touch scroll.

## Image Processing

1. Source: Shutterstock
2. PNG: https://cloudconvert.com/eps-to-png
3. Background: https://pixlr.com/remove-background/
4. Blob Maker: https://www.blobmaker.app/
5. SVG Editor: https://boxy-svg.com/
6. SVG: https://cloudconvert.com/eps-to-svg
7. WebP: https://squoosh.app/editor
8. Compress: https://compresspng.com/