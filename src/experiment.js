/**
 * @title template-project
 * @description This is a template project for jspsych experiments
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 * @miscDir html
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import * as consent from "./components/consentComponent";
import * as id from "./components/idComponent";
import * as instructions from "./components/instructionsComponent";
import * as participantDetails from "./components/participantDetailsComponent";

import { showStimProcedure } from "./procedures/showStimProcedure";

import EgoziService from "./Services/EgoziService";
import NutellaService from "./Services/NutellaService";
import IdFromUrlService from "./Services/IdFromUrlService";

import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import CallFunctionPlugin from "@jspsych/plugin-call-function";

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  global.jsPsych = initJsPsych();

  const timeline = [];

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images
  });

  let getParticipantIdFromUrl = {
    type: CallFunctionPlugin,
    func: () => { 
        let id = IdFromUrlService.getId();

        if (!id) {
          jsPsych.endExperiment("Participant ID is missing");
        }

        let data = {participantId: id}
        jsPsych.data.get().push(data);
     }
  }

  timeline.push(getParticipantIdFromUrl);

  timeline.push(participantDetails.default.getTrial());
  timeline.push(consent.default.getConsentTrial())

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

  document.addEventListener("fullscreenchange", fullScreenChangeHandler)

  timeline.push(instructions.default.getTrial());

  timeline.push((new showStimProcedure("stimuli", "stim", 4, "jpg")).getProcedure());

  let sendDataToServer = {
    type: CallFunctionPlugin,
    func: () => { 
      document.removeEventListener("fullscreenchange", fullScreenChangeHandler)

      let first_trial = jsPsych.data.get().values()[1];
      let participantId = first_trial["participantId"];
      
      sendData("galit", "jspsych-try", jsPsych.data.get(), participantId);
     }
  }

  timeline.push(sendDataToServer);

  let endMessage = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<p style="font-size: 48px;">Thank you!</p>',
    choices: jsPsych.NO_KEYS
  };

  timeline.push(endMessage)


  await jsPsych.run(timeline);
}

function fullScreenChangeHandler() {
  if (!document.fullscreenElement) {
    jsPsych.endExperiment("You can no longer participate in this experiment");
  }
}

function sendData(experimenterName, experimentName, data, participantId) {  
  data = data.values();
  NutellaService.sendDataToNutella(experimentName, experimenterName, data, participantId);
  EgoziService.sendDataToEgozi(experimentName, experimenterName, data, participantId);
}
