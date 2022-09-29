import  htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

class fixationCrossComponent {
    static getTrial() {
        let trial = {
            type: htmlKeyboardResponse,
            stimulus: "<p> + </p>",
            trial_duration: 1000
        };

        return trial;
    }
}

export default fixationCrossComponent;