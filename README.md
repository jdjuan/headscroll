# HeadScroll

### Scroller

1. Url to remain small, and then expand when clicked?
2. Canvas to be 100% of available size
3. Remove hands
4. No shadows on the sidebar
5. On mobile, I don't render the second column, and instead display the camera on top of the first one
   1. Options? I can put a options button that opens a modal with the settings to change?
   2. Yes, on the navbar, to the right, it opens a modal
6. Loading spinners removes all the content (using diplay:none with isCameraReady) except the logo, and shows nice messages (totally centered)
   1. It is loading by default
   2. It shows the camera modal
   3. Then the instruction modal
      1. Only after accepting, it should start scrolling

8. It's time to enable to your camera [Camera]
   1. Add exception for cam blocked or not found
9. Tips for a better experience | [Don't_show_again] | [woman-tilting-head]
   1. Put your camera in front of you
   2. Avoid tilting your head unless you want to scroll
10. Our mobile experience is not ready at the moment, please use a laptop | [laptop_woman] 
   3. Let me see it, I won't judge!
   4. I will try later on another device
11. Is the website displayed correctly? | [yes-no]
12. Loading indicators
   5. Also for URL submit from landing
13. Layout, remove material
14. Check/Remove bootstrap icons
15. Make the default heigh larger for my screen
16. Options
   6. Hide / Show camera
   7. Speed
   8. Invert Scrolling
   9. Report website
   10. Body Points
17. Fix bug for https://www.cifraclub.com.br/shakira/te-espero-sentada/

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
2. Test accessibility features

### Model

1. Test more and improve model

### Main

1. Button: Scroll a random song

### Security 

1. Avoid DoS


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