import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";

class imageKeyComponent {
    static getTrial() {
        let imageHeight = Math.round(window.screen.availHeight / 2);
        let trial = {
            type: ImageKeyboardResponsePlugin,
            stimulus: jsPsych.timelineVariable("path"),
            choices: ['1', '2', '3', '4'],
            prompt: '<div style="width:100%;"><img src="media/images/scale.png"></div>',
            response_ends_trial: true,
            maintain_aspect_ratio: true,
            stimulus_height: imageHeight
        };

        return trial;
    }
}

export default imageKeyComponent;