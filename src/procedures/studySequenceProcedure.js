import * as studyTrial from "../components/studyPhaseComponent";
import * as question from "../components/questionComponent";
import * as fixation from "../components/fixationCrossComponent";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

export class studySequenceProcedure {
    constructor(imagePaths, sentencesPaths, gender, onQuestionFinished, isDebug) {
        this.imagePaths = imagePaths;
        this.sentencesPaths = sentencesPaths;
        this.gender = gender;
        this.isDebug = isDebug;

        if (this.isDebug) {
            this.onQuestionFinished = () => { };
        }
    }

    getProcedure() {
        let procedure = {
            timeline: this.getTimeline()
        }

        return procedure;
    }

    getTimeline() {
        let timeline = [];

        let mistakeMessage = {
            type: HtmlKeyboardResponsePlugin,
            stimulus: 'טעית בבדיקת עירנות. לחצו על כל מקש במקלדת כדי להמשיך בניסוי'
        }

        let didMakeCatchMistake = {
            timeline: [mistakeMessage],
            conditional_function: function () {
                let prevStim = jsPsych.data.get().last(2).values()[0].stimulus;
                let data = jsPsych.data.get().last(1).values()[0];
                if (!data.stimulus.includes("question")) {
                    return false;
                }
                let isCatch = prevStim.includes("04739d205") || prevStim.includes("04562d105B") || prevStim.includes("catch");

                if (data.response != 0 && isCatch) {
                    if (data.stimulus.includes("female")) {
                        console.log("in end experiment")
                        jsPsych.endExperiment("טעית בבדיקת עירנות, לכן לא ניתן להמשיך בניסוי.");

                        return false;
                    }
                    return true;
                } else if (data.response == 0 && !isCatch) {
                    if (data.stimulus.includes("female")) {
                        console.log("in end experiment")
                        jsPsych.endExperiment("טעית בבדיקת עירנות, לכן לא ניתן להמשיך בניסוי.");

                        return false;
                    }
                    return true;
                }
                return false;
            }
        }

        let length = this.imagePaths.length > 10? 10: this.imagePaths.length;

        for (let i = 0; i < this.imagePaths.length; i++) {
            timeline.push(studyTrial.default.getTrial(this.imagePaths[i], this.sentencesPaths[i]));
            timeline.push(question.default.getTrial(this.gender, () => {}, this.isDebug));

            if (!this.isDebug) {
                //timeline.push(didMakeCatchMistake);
            }

            timeline.push(fixation.default.getTrial());
        }

        return timeline;
    }

}