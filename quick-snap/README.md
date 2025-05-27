# Hot Export

A Figma plugin for quick exporting of selected layers with customizable settings.

## Features

- **One-Click Export**: Export directly to your computer with a single click
- **Customizable Export Settings**: Change default export format and scale
- **Export Assets Page**: Option to automatically copy exported assets to a dedicated "Export Assets" page

## How to Use

### Quick Export from UI
1. Go to "Plugins > Hot Export > Open Hot Export" to open the plugin panel
2. Select one or more layers in your Figma document
3. Adjust settings if needed
4. Click the "Export Selection" button
5. The files will be downloaded to your computer automatically

### Quick Export from Menu
1. Select one or more layers in your Figma document
2. Right-click and select "Plugins > Hot Export > Quick Export"
3. The files will be downloaded to your computer automatically using your saved settings

### Setting up Keyboard Shortcuts
Figma allows you to set up custom keyboard shortcuts for plugin commands:
1. Go to Figma menu > Preferences > Keyboard Shortcuts
2. Search for "Hot Export"
3. Add a keyboard shortcut (like Option+E / Alt+E) for the "Quick Export" command

### Configure Settings
1. Open the plugin panel via "Plugins > Hot Export > Open Hot Export"
2. Select your preferred file type (PNG, JPG, SVG, PDF)
3. Choose your preferred scale (1x, 2x, 3x, 4x)
4. Toggle the option to copy to "Export Assets" page if desired
5. Click "Save Settings" to store your preferences for future use

## How the Export Process Works

When you click "Export Selection" in the plugin:
1. The plugin applies your selected export settings to the selected layers
2. The plugin exports each layer and sends the data to your browser
3. Files are automatically downloaded to your computer's default download location
4. Each file is named using the layer name and export settings (e.g., `layer_name_2x.png`)

## Development

The plugin is built with TypeScript. To make changes:

1. Install dependencies: `npm install`
2. Make changes to the code
3. Build the plugin: `npm run build`
4. Reload the plugin in Figma

## License

This plugin is distributed under the MIT license.

Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
