##Ogame Battle Simulator

Hi, this is an Nodejs battle simulator, based on the rules of Ogame.

This is a proof of concept, since there are faster Ogame simulators in the web. However, node.js provides a very good speed.


Note: Currently I'm not including a GUI to enter ships and technologies, you need to edit a text file instead.
I might add a web form in the future.


###Usage

After cloning the repository, run:

````
npm install
````

Then, edit *app.js* in order to build your desired simulation. (check ogsim/config.js for a list of valid resources/ships/defenses)

Finally, run:

````
nodejs app.js
````

And you will see some untidy info in the console, showing the results of the battle :)


### Web version

The file *ogsim-browserify.js* was generated with this command:

````
browserify ogsim.js -o ogsim-browserify.js
````

Make sure you have Browserify installed globally. Also, this line must be uncommented in ogsim/timer.js before running it:

````
process.hrtime = require('browser-process-hrtime');
````

*ogsim.js* creates the global variable OgsimBattle, based on the module *ogsim/battle.js*. See debug.html as an example.

Open debug.html in a browser, and you will see the statistics in the javascript developer console.

The browser will stop responding for a while, depending on how big are the fleets indicated in debug.html


### TODO

- Enable/Disable RapidFire, allow many battle simulations, etc ...
- Web GUI, and parallel processes in web browsers.