import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";

class questionComponent {
    static getTrial(gender, onQuestionFinished, isDebug) {
        console.log("im in debug" + isDebug)
        let imageHeight = Math.round(window.screen.availHeight / 2);
        let trial = {
            type: ImageKeyboardResponsePlugin,
            stimulus: "media/images/stimuli/question_" + gender + ".JPG",
            choices: ['0','1','2'],
            response_ends_trial: true,
            maintain_aspect_ratio: true,
            stimulus_height: imageHeight,
            on_finish: (data) => {
                let trials = jsPsych.data.get().trials;
                console.log(jsPsych.data.get().last(2).first())
                jsPsych.data.get().last(2).first().addToLast({response: data.response})
                console.log(jsPsych.data.get().last(2).first())
            }
        };

        if (isDebug) {
            trial.response_ends_trial = false;
            trial.trial_duration = 1000;
            trial.on_finish = (data) => {
                data.response = 2;
            }
        }

        return trial;
    }
}

export default questionComponent;