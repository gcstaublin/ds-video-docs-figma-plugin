"use strict";
// This shows the HTML page in "ui.html".
// figma.showUI(__html__);
figma.root.setRelaunchData({ attach: 'yo' });
// Grabs the frame/component a user has selected in Figma when launching the plugin
let node = figma.currentPage.selection && figma.currentPage.selection[0];
// If a user launches the plugin without having anything selected
if (!node) {
    figma.closePlugin('Select a layer to attach a video');
}
else {
    // Get the embed code a user has pasted into a textarea and attach the embed code to the frame/component the user has originally selected in Figma
    let embedCode = node.getPluginData('embedCode');
    let command = figma.command || "attach";
    if (command === "attach") {
        figma.showUI(`
      <style>
        body{
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0.75rem;
          margin: 0;
          box-sizing: border-box;
          align-item: start;
        }
        .textarea{
          width: 100%;
          flex-grow: 1;
          margin-bottom: 0.75rem;
        }
      </style>
      <textarea placeholder="Paste video embed code" class="textarea hello">${embedCode}</textarea>
      <button onclick="attachVideo()" class="button button--primary">Attach Video</button>
      <script>
        function attachVideo(){
          let textarea = document.querySelector("textarea")
          parent.postMessage({
            pluginMessage: textarea.value
          }, '*')
        }
      </script>
    `, {
            title: `Attach video`,
            width: 400,
            height: 200
        });
        function attachVideoTo(node, embedCode) {
            node.setPluginData('embedCode', embedCode);
            if (embedCode.trim() === "") {
                node.setRelaunchData({});
            }
            else {
                node.setRelaunchData({ play: '', attach: 'Attach or edit a video embed for the component' });
            }
        }
        figma.ui.onmessage = embedCode => {
            if (node.type === "COMPONENT_SET") {
                node.children.forEach(variant => {
                    attachVideoTo(variant, embedCode);
                });
            }
            else {
                attachVideoTo(node, embedCode);
            }
            figma.closePlugin();
        };
    }
    else if (command === "play") {
        // When in play mode, we make the modal larger for a better viewing experience
        figma.showUI(`<style>
        html, body, iframe{
          margin: 0;
          width: 100%;
          height: 100%;
        }
       </style>
       ${embedCode}`, {
            title: 'Watch Component Intro',
            width: 675,
            height: 450
            // width: 600,
            // height: 400
        });
    }
} // end else
