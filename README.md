# Trying to make 3d gaussian splats
Tried recording a video of my face and converting it to a 3d model using gaussian splats.

## gaussian splats
it's a 3d rendering technique that models the world using millions of small 3d ellipses.
I first saw this on 'X' thanks tot this guy https://superspl.at/scene/29f9b77d and decided to try it out.

# What i tried
First i'm trying luma ai, but will try to train it locally in the future for better results.

To show the splat in the web page, i tried using various rendering libraries. Eventually, decided to use Spark:
https://sparkjs.dev/
I first copied the Quick Start, but didn't like how it obrited my face, so i looked for examples on orbiting controls. 
Spark uses THREE.js for the 3d viewport so i had to use it to set up the controls.
Found this example and copied the controls:
https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_orbit.html
Then positioned the camera and controls to my liking and disabled panning.
