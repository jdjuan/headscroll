# HeadScroll

#### Tutorial

REVIEW MOBILE DESIGN
change CDK breakout to use bootstrap lg
add options

fix zoom
1. Remove hands
2. On mobile, I don't render the first column, and instead display the camera on the right bottom corner
   1. Options? I can put a options button that opens a modal with the settings to change
3.  It's time to enable to your camera [Camera]
   2. Add exception for cam blocked or not found
4.  Tips for a better experience | [Don't_show_again] | [woman-tilting-head]
   3. Put your camera in front of you
   4. Avoid tilting your head unless you want to scroll
5.  Our mobile experience is not ready at the moment, please use a laptop | [laptop_woman] 
   5. Let me see it, I won't judge!
   6.  I will try later on another device
6.  Is the website displayed correctly? | [yes-no]
7.  Check/Remove bootstrap icons
8.  Make the default heigh larger for my screen
9.  Options
   7.  Hide / Show camera
   8.  Speed
   9.  Invert Scrolling
   10. Report website
   11. Body Points

Reduce image resolution and seize

- Fix lacuerda https://chords.lacuerda.net/heroes_del_silencio/la_chispa_adecuada-3.shtml
  - cookies modal that hides content
### Backend

1. Store websites searched (both the URL and URI), and keep the count
2. Admin View to Blacklist and whitelist.
   1. https://twitter.com/cifraclub

### Buy me a coffee

1. Customize page

### SEO

1. OG and SEO Tags, Images for social media
2. Add Google Analytics
4. Add product hunt reference
5. Send email my personal subscription list
6. Tweet, tagging: https://twitter.com/ire_alva

### Test

1. Test in other browsers, OS's, and devices
2. Test accessibility features
3. Test model (and improve)

### Next Steps

1. Button: Scroll a random song
2. Avoid DoS 

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