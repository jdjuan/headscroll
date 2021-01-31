## Image Processing

1. Source: Shutterstock
2. PNG: https://cloudconvert.com/eps-to-png
3. Background: https://pixlr.com/remove-background/
4. Blob Maker: https://www.blobmaker.app/
5. SVG Editor: https://boxy-svg.com/
6. SVG: https://cloudconvert.com/eps-to-svg
7. WebP: https://squoosh.app/editor
8. Compress: https://compresspng.com/

## Modals Flows

1. Observer error - 
   1. Display modals (enable, block)
      1. Take enable ref and store
      2. If no error, and ref, then dismiss
2. [CS]Check if camera is available - Start a timer for 3 seconds
   1. If 3 seconds pass, then throw error
   2. If the camera is allowed, then dispatch an action that clears the error, and puts camera onReady
   3. If the camera is blocked, then dispatch an action
3. If camera onReady
   1. checkWebGl, and dispatch action for webGl (either error, success)
4. If webGl fired, 
   1. If not supported, display modal
   2. If supported, check if it's mobile
      1. If it's mobile then display modal, and wait for ref to change loading to false
      2. If not, then change loading to false

{
    supportWebGL
    cameraStatus: ready | blocked | timedout
    searchError
}