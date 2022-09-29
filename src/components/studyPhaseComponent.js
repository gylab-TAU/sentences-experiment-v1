import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";

class studyPhaseComponent {
    static getTrial(imagePath, sentencePath) {
        let imageHeight = 300;
        let trial = {
            type: ImageKeyboardResponsePlugin,
            stimulus: imagePath,
            prompt: '<div style="width:100%;"><img src="' + sentencePath + '"></div>',
            response_ends_trial: false,
            maintain_aspect_ratio: true,
            trial_duration: 8000,
            stimulus_height: imageHeight,
            on_finish: (data) => {
                let currTrial =jsPsych.getCurrentTrial();

                let imagePath = currTrial.prompt;

                let position1 = imagePath.search("media");
                let position2 = imagePath.search(".jpg") + 4;

                data.sentence = imagePath.slice(position1, position2);
                data.isImage = true;
            }
        };

        return trial;
    }
}

export default studyPhaseComponent;