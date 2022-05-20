# svg-test

svg-test contains an angular workspace with an application to try the implemented builders.

# How are they integrated

In order to integrate the builders, first we have to do is to install them.
You can add them as dev-depencency in the package.json:

```
"devDependencies": {
    "cogni-builders": "../cogni-builders",
}
```

In this case it is added as a relative local path that points to the folder where the builder package's package.json is.

The builder package is called "cogni-builders"

Second step to integrate the builders is to add them in the angular.json:

```
{
    "projects": { 
        "svg-test": {
            "architect": {
                "svg": {
                    "builder": "cogni-builders:svg-generator",
                    "options": {
                        "configFile": "./src/config/svg.json"
                    }
                }
            }
        }
    }
}
```

In the architect of the application add a new property with the name you like.
As builder you have to put the package name with the builders followed with the name of the builder you want to use: `package-name-installed-in-node-modules:builder-to-use-inside-package-name`.

As options, you have to pass the required data for the builder. In this case it only requires a path to a config file. You can place the config file wherever you prefer inside this workspace.

Now let's see how the config file looks like:

```
{
    "inputDir": "node_modules/awesome-svg/assets",
    "outputDir": "src/generated-svg",
    "prefix": "app",
    "modules": [
        {
            "name": "ShapesSvg",
            "files": [
                "circle",
                "square"
            ]
        },
        {
            "name": "FruitsSvg",
            "files": [
                "apple",
                "banana"
            ]
        }
    ]
}
```

These file contains more options that will be used by the builder.

* **inputDir**: path to the directory with the resources (svg icons) that the builder has to read in order to build the angular components. In this case I have created also a package with resources and I have installed it in the node_modules folder.

* **outputDir**: path where the angular componentes and modules will be created.

* **prefix**: you know that angular recominds to prefix your component with a custom prefix to avoid component collisions. In this case I continue using `app`, but you can use the prefix of your app or library.

* **modules**: This is an array that contains an object for each module you want to create. The object contains the module name (without Module, the builder will append it), and an array with all the icons this module will declare. The array contains the name of the files without the extension. In this case the builder will look up the svg file in `node_modules/awesome-svg/assets/banana.svg`, for example.

# How to run the builder

In the workspace root folder run the following command: `ng run svg-test:svg`.
It uses the `ng run` and then the name of the project (application) and the architect name.

You can also override the configuration options in the angular.json passing the options manually: `ng run svg-test:svg --configFile anotherPathToAnotherConfigFile`

Running these commands will generate the components and modules in the path you specified inside the config file. Import the modules with the icons you want to use in your feature module and consume them as `<svg prefixIconFileNameSvg></svg>` They will appear in the screen! And you didn't have to write a lot of code! Even you can reuse it everywhere.