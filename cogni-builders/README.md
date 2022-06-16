# Structure

To create a custom builder, we need to create a npm package. The package.json has a special property called `"builders"` and its value is the name of the file where we define our builders.

Of course, we also have `"main": "index.js",` that exports all the code we will build. It is `js` and not `ts` because we will export the code already traspiled.

Appart from the package.json, because we are using typescript, we have to add as well our tsconfig.json.

# builders.json

This file contains a json object with a property called `"builders"`. The `builders` property object  will contain one property for each of the builders we include in the npm package, so we can import multiple builders just importing one single npm package.

Each builder has:
 * implementation: path to the file where the builder is implemented.
 * schema: path to the file where we define the options that the builder can receive to operate.
 * description: Free text that describes the builder, what the builder does.

# How is the builder folder

I have created a folder to put our code for the builder. Each builder in one folder...

The folder contains the index.ts file where the code of the builder is, and the schema.json that defines the options of the builder. In this case I have only added one property which is the path of a file with more options.

The options inside the file are defined in `options.ts` too.

# The code of the builder

The code of the builder is inside the index.ts file.

The builder is just a function like this: 
```
export default createBuilder<Options>((options, context) => {
  return new Promise<BuilderOutput>((resolve) => {
      // All the code of your builder goes here
  });
});
```

The output of the promise is of type `BuilderOutput`. Let's have a look to the definition types:

```
export interface Schema {
    error?: string;
    info?: {
        [key: string]: any;
    };
    success: boolean;
    target?: Target;
}
export interface Target {
    configuration?: string;
    project?: string;
    target?: string;
}
```

Basically it returns a `success` property that indicates if everything went well or not. In case of error we can indicate what happened in the `error` property.

Our builder function takes two parameters: the `options` we defined in the schema.json and a context. The context has information about the angular project. For example in this case we used it to get the path of the project and generate the components in the correct folder.

# Build the builder to use it

Run the command `npm run build` to compile the code and get the js files. It basically invokes the tsc command to tell typescript to use the tsconfig file and traspile our ts files.