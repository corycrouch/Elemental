// Hot Export Plugin - Quickly export selected layers with customizable settings

// Define default settings and types
interface HotExportSettings {
  fileType: string;
  scale: string;
}

// Default settings
const DEFAULT_SETTINGS: HotExportSettings = {
  fileType: 'PNG',
  scale: '2'
};

// Load saved settings or use defaults
let settings: HotExportSettings = DEFAULT_SETTINGS;
let isQuickExportMode = false; // Track if we're in quick export mode vs UI mode

// This is the primary entry point for commands (including hotkeys)
figma.on('run', async (event) => {
    // Load settings first, as all commands might need them
    try {
        const savedSettings = await figma.clientStorage.getAsync('hotExportSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings as string);
        } else {
            settings = DEFAULT_SETTINGS; // Use defaults if nothing saved
        }
    } catch (e) {
        console.error("Error loading settings:", e);
        settings = DEFAULT_SETTINGS; // Fallback to defaults on error
    }

    // Now, check which command triggered the run event
    if (event.command === 'quickExport') {
        // This block runs when the "Quick Export" command (hotkey) is used
        await performQuickExport();
    } else {
        // This block runs when the "Open Hot Export" (settings) command is used or no command specified
        isQuickExportMode = false; // We're in UI mode, not quick export mode
        
        const panelWidth = 172;
        const panelHeight = 194;
        const margin = 24;
        const bottomMargin = 60; // Extra margin for bottom to account for UI chrome
        
        // Calculate position accounting for zoom level
        const zoom = figma.viewport.zoom;
        const viewportPixelWidth = figma.viewport.bounds.width * zoom;
        const viewportPixelHeight = figma.viewport.bounds.height * zoom;
        
        // Position in canvas coordinates for bottom-right placement
        const x = figma.viewport.bounds.x + figma.viewport.bounds.width - (margin + panelWidth) / zoom;
        const y = figma.viewport.bounds.y + figma.viewport.bounds.height - (bottomMargin + panelHeight) / zoom;
        
        figma.showUI(__html__, { 
            width: panelWidth, 
            height: panelHeight, 
            themeColors: true,
            position: { x, y }
        });
        
        // Send current settings to the UI
        figma.ui.postMessage({
            type: 'init',
            settings
        });
        
        // Send initial selection state
        figma.ui.postMessage({
            type: 'selection-changed',
            hasSelection: figma.currentPage.selection.length > 0,
            selectionCount: figma.currentPage.selection.length
        });
        
        // Set up message handlers
        setupMessageHandlers();
        
        // Listen for selection changes
        figma.on('selectionchange', () => {
            figma.ui.postMessage({
                type: 'selection-changed',
                hasSelection: figma.currentPage.selection.length > 0,
                selectionCount: figma.currentPage.selection.length
            });
        });
    }
});

// Set up message handlers for UI communication
function setupMessageHandlers() {
    figma.ui.onmessage = async (msg) => {
        if (msg.type === 'save-settings') {
            settings = msg.settings;
            await figma.clientStorage.setAsync('hotExportSettings', JSON.stringify(settings));
            
            // Update Figma's native export settings for selected nodes
            updateNativeExportSettings();
            
            // Send confirmation to the UI to show the autosave indicator
            figma.ui.postMessage({
                type: 'settings-saved'
            });
        } else if (msg.type === 'export') {
            // This is the message from the UI's 'Export' button
            settings = msg.settings; // Update settings from UI before export
            await figma.clientStorage.setAsync('hotExportSettings', JSON.stringify(settings)); // Save settings
            
            // Update Figma's native export settings for selected nodes
            updateNativeExportSettings();
            
            await performExport(); // Perform export after settings are updated
        } else if (msg.type === 'downloadComplete') {
            // Show notification but don't close plugin - let user close manually
            figma.notify(msg.message || 'Export successful!');
            // Only auto-close if we're in quick export mode
            if (isQuickExportMode) {
                figma.closePlugin();
            }
        } else if (msg.type === 'downloadFailed') {
            figma.notify(msg.message || 'Export failed!', { error: true });
            // Don't close plugin on failure either - let user try again
            // Only auto-close if we're in quick export mode
            if (isQuickExportMode) {
                figma.closePlugin();
            }
        } else if (msg.type === 'close') {
            // Close the plugin when the close button is clicked
            figma.closePlugin();
        }
    };
}

// Function to update Figma's native export settings for selected nodes
function updateNativeExportSettings() {
    const selectedNodes = figma.currentPage.selection;
    
    if (selectedNodes.length === 0) {
        return; // No nodes selected
    }
    
    // Get scale as a number
    const scale = parseInt(settings.scale);
    
    // Create export settings based on the plugin settings
    let exportSetting: ExportSettings;
    
    if (settings.fileType === 'PNG' || settings.fileType === 'JPG') {
        exportSetting = {
            format: settings.fileType as 'PNG' | 'JPG',
            constraint: { type: 'SCALE', value: scale }
        };
    } else if (settings.fileType === 'SVG') {
        exportSetting = {
            format: 'SVG',
            contentsOnly: true,
            svgOutlineText: true,
            svgIdAttribute: false,
            svgSimplifyStroke: true
        };
    } else if (settings.fileType === 'PDF') {
        exportSetting = {
            format: 'PDF'
        };
    } else {
        // Default to PNG
        exportSetting = {
            format: 'PNG',
            constraint: { type: 'SCALE', value: scale }
        };
    }
    
    // Update export settings for each selected node
    for (const node of selectedNodes) {
        // Check if node supports exportSettings property
        if ('exportSettings' in node) {
            // Replace existing export settings with our new one
            node.exportSettings = [exportSetting];
        }
    }
    
    // Settings updated silently without notification
}

// Function to perform the export
async function performExport() {
    if (figma.currentPage.selection.length === 0) {
        figma.notify('Please select at least one layer to export', { error: true });
        return;
    }

    // Make sure we have a UI to communicate with
    if (!figma.ui) {
        figma.showUI(__html__, { visible: false, width: 0, height: 0 });
        setupMessageHandlers();
        // Short delay to ensure UI is ready
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
        const selectedNodes = figma.currentPage.selection;
        const scale = parseInt(settings.scale);
        
        // --- NEW: Determine if this is a batch export (multiple files) ---
        const isBatchExport = selectedNodes.length > 1;
        
        if (isBatchExport) {
            // Get the file name for the ZIP
            const figmaFileName = figma.root.name || 'Export';
            
            // Signal to UI that batch export is starting
            figma.ui.postMessage({ 
                type: 'batchStart', 
                totalFiles: selectedNodes.length,
                figmaFileName: figmaFileName
            });
        }

        for (const node of selectedNodes) {
            try {
                let exportOptions: ExportSettings;

                if (settings.fileType === 'PNG' || settings.fileType === 'JPG') {
                    exportOptions = {
                        format: settings.fileType as 'PNG' | 'JPG',
                        constraint: { type: 'SCALE', value: scale }
                    };
                } else if (settings.fileType === 'SVG') {
                    exportOptions = {
                        format: 'SVG',
                        contentsOnly: true,
                        svgOutlineText: true,
                        svgIdAttribute: false,
                        svgSimplifyStroke: true
                    };
                } else if (settings.fileType === 'PDF') {
                    exportOptions = {
                        format: 'PDF'
                    };
                } else {
                    exportOptions = {
                        format: 'PNG',
                        constraint: { type: 'SCALE', value: scale }
                    };
                }

                const fileExt = settings.fileType.toLowerCase();
                const fileName = `${node.name.replace(/[^a-z0-9]/gi, '_')}_${scale}x.${fileExt}`;

                const imageBytes = await node.exportAsync(exportOptions);

                // --- MODIFIED: Send different message types based on batch vs single export ---
                if (isBatchExport) {
                    // Send individual file data for batch processing
                    figma.ui.postMessage({
                        type: 'fileData',
                        bytes: imageBytes.buffer,
                        fileName: fileName,
                        fileType: fileExt
                    });
                } else {
                    // Send single file download for immediate download
                    figma.ui.postMessage({
                        type: 'download',
                        bytes: imageBytes.buffer,
                        fileName: fileName,
                        fileType: fileExt
                    });
                }

            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                console.error('Export error:', error);
                figma.notify(`Failed to export ${node.name}: ${error.message}`, { error: true });
            }
        }
        
        // --- NEW: Signal batch completion if this was a batch export ---
        if (isBatchExport) {
            figma.ui.postMessage({ type: 'batchComplete' });
            figma.notify(`Preparing batch export of ${selectedNodes.length} item(s)...`); // Notify user about batch prep
        } else {
            // Show success message for single file export based on collect toggle state
            figma.notify('Exported');
        }

    } catch (err) {
        const error = err as Error;
        figma.notify('Export failed: ' + error.message, { error: true });
    }
}

// Function to handle the quick export command
async function performQuickExport() {
    isQuickExportMode = true; // We're in quick export mode
    
    // Initialize with UI hidden, but setup message handlers
    figma.showUI(__html__, { visible: false, width: 0, height: 0 });
    
    // Set up message handlers for the hidden UI
    setupMessageHandlers();
    
    // Wait a moment for the UI to initialize (give it time to load in the iframe)
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms should be plenty
    
    // Send settings to UI (even though it's hidden)
    figma.ui.postMessage({
        type: 'init',
        settings
    });

    // Update Figma's native export settings for selected nodes
    updateNativeExportSettings();

    // Perform export with current settings
    await performExport();

    // --- MODIFIED: Don't automatically close the plugin ---
    // The plugin will be closed by the 'downloadComplete' message from the UI
    // after the ZIP download is triggered (for batch exports) or after single download
    // Set a longer timeout as a fallback in case something goes wrong
    setTimeout(() => {
        figma.closePlugin();
    }, 10000); // 10 seconds should be plenty for ZIP processing
}
