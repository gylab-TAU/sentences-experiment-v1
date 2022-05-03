import * as stimTrial from "../components/imageKeyComponent";

export class showStimProcedure {
    constructor(stimFolder, stimImageName, numOfStims, fileExtension) {
        this.stimFolder = stimFolder;
        this.stimImageName = stimImageName;
        this.numOfStims = numOfStims;
        this.fileExtension = fileExtension;
    }

    getProcedure() {
        let procedure = {
            timeline: [stimTrial.default.getTrial()],
            timeline_variables: this.getTimelineVariables(),
            randomize_order: true
        }

        return procedure;
    }

    getTimelineVariables() {
        let timelineVariables = [];

        for (let i = 1; i <= this.numOfStims; i++) {
            let path = "media/images/" + this.stimFolder + "/" + this.stimImageName + i + "." + this.fileExtension;
            let pathObject = {path: path};

            timelineVariables.push(pathObject);
        }

        return timelineVariables;
    }
}