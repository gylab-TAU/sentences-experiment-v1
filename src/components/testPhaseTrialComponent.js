import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";

class testPhaseComponent {
    static getTrial(imagePath, sentencePath, gender, isDebug) {
        let imageHeight = 300;
        let trial = {
            type: ImageKeyboardResponsePlugin,
            stimulus: imagePath,
            choices: ['1', '2', '3', '4', '5', '6'],
            prompt: '<div class="prpmpt" style="width:100%;"><img src="' + sentencePath + '"><img src="media/images/stimuli/scale_' + gender + '.JPG"></div>',
            response_ends_trial: true,
            maintain_aspect_ratio: true,
            stimulus_height: imageHeight,
            on_finish: (data) => {
                let currTrial =jsPsych.getCurrentTrial();

                let imagePath = currTrial.prompt;

                let position1 = imagePath.search("media");
                let position2 = imagePath.search(".jpg") + 4;;

                data.sentence = imagePath.slice(position1, position2);
                data.isImage = true;
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

export default testPhaseComponent;