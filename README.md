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


### TODO

- Instructions on how to use browserify and the debug.html file
- Enable/Disable RapidFire, allow many battle simulations, etc ...
- Web GUI, and parallel processes in web browsers.