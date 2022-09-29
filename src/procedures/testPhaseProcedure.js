import * as testTrial from "../components/testPhaseTrialComponent";

export class testSequenceProcedure {
    constructor(imagePaths, sentencePaths, gender) {
        this.imagePaths = imagePaths;
        this.sentencePaths = sentencePaths;
        this.gender = gender;
    }

    getProcedure(isDebug) {
        let procedure = {
            timeline: this.getTimeline(isDebug)
        }

        return procedure;
    }

    getTimeline(isDebug) {
        let timeline = [];
        let length = this.imagePaths.length > 10? 10: this.imagePaths.length;
        for(let i = 0; i < this.imagePaths.length; i++){
            timeline.push(testTrial.default.getTrial(this.imagePaths[i], this.sentencePaths[i], this.gender, isDebug));
        }

        return timeline;
    }
}