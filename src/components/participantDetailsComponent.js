import { JsPsych } from "jspsych";
import ExternalHtmlPlugin from "@jspsych/plugin-external-html";

import "../../styles/participantDetails.scss"

class participantDetailsComponent {
    static checkAndSave() {
        let age = document.getElementById("participantAge").value;
        let participantGender = document.getElementById("participantGender").value;
        let participantHandedness = document.getElementById("participantHandedness").value;

        if (age == "" || participantGender == "none" || participantHandedness == "none") {
            return false;
        } else {
            let participantDetails = {
                age: age,
                gender: participantGender,
                handness: participantHandedness
            }
            jsPsych.data.addProperties({participantDetails: participantDetails});

            return true;
        }
    }

    static getTrial() {
        let trial = {
            type: ExternalHtmlPlugin,
            url: "media/html/participantDetails.html",
            cont_btn: "submitParticipantDetails",
            check_fn: participantDetailsComponent.checkAndSave
        };

        return trial;
    }
}

export default participantDetailsComponent;