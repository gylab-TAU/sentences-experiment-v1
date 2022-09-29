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
import { practicePhaseProcedure } from "./procedures/practicePhaseProcedure";
import { studyPhaseProcedure } from "./procedures/studyPhaseProcedure";
import { testSequenceProcedure } from "./procedures/testPhaseProcedure";

import EgoziService from "./Services/EgoziService";
import NutellaService from "./Services/NutellaService";
import IdFromUrlService from "./Services/IdFromUrlService";
import conditionAssignmentService from "./Services/conditionAssignmentService";

import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import CallFunctionPlugin from "@jspsych/plugin-call-function";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";
import SurveyMultiChoicePlugin from "@jspsych/plugin-survey-multi-choice";

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */

 let tag = document.createElement("script");
 tag.type = "text/javascript";
 tag.src = "jatos.js"

 document.head.appendChild(tag);
export async function run({ assetPaths, input = {}, environment }) {
  global.jsPsych = initJsPsych({
    on_finish: function () {
      jsPsych.data.displayData('csv');

    }
  });

  const conditions = conditionAssignmentService.assignConditions(assetPaths["images"]);

  const timeline = [];

  // // Preload assets
  // timeline.push({
  //   type: PreloadPlugin,
  //   images: assetPaths.images
  // });


  let getParticipantIdFromUrl = {
    type: CallFunctionPlugin,
    func: () => {
      let id1 = IdFromUrlService.getId();
      let id2 = jatos.urlQueryParameters.subjectID

      if (!id1 && !id2) {
        jsPsych.endExperiment("Participant ID is missing");
      }

      let id = id1;

      if (!id1) {
        id = id2;
      }

      let data = { participantId: id }
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

  timeline.push(instructions.default.getTrial(2, 10));

  timeline.push((new practicePhaseProcedure(assetPaths["images"])).getProcedure());

  let isDebug = false;
  timeline.push((new studyPhaseProcedure(conditions).getProcedure(isDebug)));

  let testImages = conditions.testDesign.map(item => item.image);
  let testSentences = conditions.testDesign.map(item => item.sentences);

  timeline.push((new testSequenceProcedure(testImages, testSentences, "female")).getProcedure())

  timeline.push(instructions.default.getTrial(19, 19));

  let debrief1Trial = {
    type: SurveyTextPlugin,
    questions: [
      { prompt: 'בהוראות של המטלה ביקשנו ממך לזכור את הפרצופים. מה היתה הדרך שלך לנסות ולזכור אותם?', name: "debrief1", required: true, rows: 4 },
    ], 
    on_finish: (data) => {
      data.isDebrief = true;
    }
  }

  timeline.push(debrief1Trial);

  let debrief2Trial = {
    type: SurveyMultiChoicePlugin,
    questions: [
      {
        prompt: "היינו מעוניינים לדעת האם היו גורמים נוספים שהשפיעו על הביצוע שלך במטלה. נעריך את תשובתך הכנה, היא לא תשפיע על התגמול שלך בניסוי. האם במהלך ההשתתפות שלך היו רעשים או הפרעות אחרות שהסיחו את דעתך?",
        name: 'debrief2',
        options: ['כן, לאורך כל הניסוי', 'כן, רק במהלך הלמידה', 'כן, רק במהלך המבחן', 'לא היו רעשים או הפרעות בשום שלב.'],
        required: true
      },
      {
        prompt: "האם הצלחת להתרכז במהלך המטלה?",
        name: 'debrief3',
        options: ['כן, לאורך כל הניסוי.', 'היה לי קשה רק בשלב הלמידה', 'היה לי קשה רק במהלך המבחן', 'היה לי קשה לאורך כל הניסוי'],
        required: true
      }
    ], 
    
    on_finish: (data) => {
      data.isDebrief = true;
    }
  }

  timeline.push(debrief2Trial);
  let redirect = function () {

    window.location.href = "http://www.w3schools.com"
  };

  let sendDataToServer = {
    type: CallFunctionPlugin,
    async: true,
    func: async (done) => {
      document.removeEventListener("fullscreenchange", fullScreenChangeHandler)

      let filteredData = jsPsych.data.get().filterCustom((trial) => {
        return (trial.stimulus != '<p> + </p>' && trial.isImage == true) || trial.isDebrief == true;
      })

      let first_trial = jsPsych.data.get().values()[0];
      let participantId = first_trial["participantId"];

      filteredData = filteredData.ignore(["trial_type", "trial_index", "internal_node_id", "time_elapsed"]);

      await sendData("galit", "sentences-experiment-v1", filteredData.trials, participantId);
    }
  }

  timeline.push(instructions.default.getTrial(23, 23));

  timeline.push(sendDataToServer);



  let endMessage = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<p style="font-size: 48px;">Thank you!</p>',
    choices: "NO_KEYS"
  };



  await jsPsych.run(timeline);

}

function fullScreenChangeHandler() {
  if (!document.fullscreenElement) {
    jsPsych.endExperiment("You can no longer participate in this experiment");
  }
}

async function sendData(experimenterName, experimentName, data, participantId, timeline, redirect) {
  jatos.endStudyAndRedirect("https://tau-psychology.sona-systems.com/webstudy_credit.aspx?experiment_id=1907&credit_token=af26e06abfd04a32a57dbe6a77635100&survey_code=%SURVEY_CODE%", data);
}
