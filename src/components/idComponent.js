import ExternalHtmlPlugin from "@jspsych/plugin-external-html";

class idComponent {
    static checkAndSave() {
        let id = document.getElementById("participantId").value;

        if (id == "") {
            return false;
        } else {
            jsPsych.data.addProperties({participantId: id});

            return true;
        }
    }

    static getTrial() {
        let trial = {
            type:ExternalHtmlPlugin,
            url: "media/html/idComponent.html",
            cont_btn: "continue",
            check_fn: idComponent.checkAndSave
        };

        return trial;
    }
}

export default idComponent;