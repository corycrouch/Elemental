# Elemental

A Figma plugin for quickly exporting selected layers with customizable settings.

## Features

- **Quick Export**: Export selected layers instantly with hotkey support
- **Customizable Settings**: Choose file format (PNG, JPG, SVG, PDF) and scale (1x-4x)
- **Copy Fill Colors**: Extract and copy fill colors in various formats (HEX, RGB, RGBA, HSL)
- **Batch Export**: Export multiple selections as a ZIP file

## Usage

### Panel Mode
1. Go to "Plugins > Elemental > Open Panel" to open the plugin panel
2. Select one or more layers in your design
3. Choose your export settings (format, scale)
4. Click "Export" to download files

### Quick Export from Menu
1. Select the layers you want to export
2. Right-click and select "Plugins > Elemental > Quick Export"
3. Files will be exported with your saved settings

### Keyboard Shortcuts
1. Install the plugin
2. Go to Figma menu > Preferences > Keyboard Shortcuts
3. Add a keyboard shortcut (like Command + Option + P) for the desired commands, like "Quick Export"

## Copy Fill Colors
1. Open the plugin panel via "Plugins > Elemental > Open Panel"
2. Select a single layer with a fill color
3. Choose your preferred color format (HEX, RGB, RGBA, HSL)
4. Click "Fill" to copy the color to your clipboard

## Settings

The plugin remembers your preferences:
- **File Format**: PNG, JPG, SVG, or PDF
- **Scale**: 1x, 2x, 3x, or 4x
- **Color Format**: HEX, RGB, RGBA, or HSL
- **Additional Options**: Include stroke, shadow, and text content in exports

## Installation

1. Download the plugin files
2. In Figma, go to Plugins > Development > Import plugin from manifest
3. Select the manifest.json file
4. The plugin will be available in your Plugins menu

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
