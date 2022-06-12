 # Vue Snake

Simple implementation of the famous Snake game, in Vue, JS and CSS.

It works pretty well but due to the asyncronicity of JS, the timer that moves the snake,
could work very bad and would not respect the interval. This depends on what is doing the browser in the meanwhile. Normally this should be
of 250ms and for each point decreases by 2.

On Micrsoft Edge this issue happens almost immediately, but on Safari always works perfectly. This could be due to the memory optimization that safari has for the M1 chips.

Preview the game on github pages:
https://leicaflorian.github.io/snake_game/