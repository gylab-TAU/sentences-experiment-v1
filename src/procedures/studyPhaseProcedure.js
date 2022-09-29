import * as instructions from "../components/instructionsComponent";
import { studySequenceProcedure } from "../procedures/studySequenceProcedure";

export class studyPhaseProcedure {
    constructor(designs){
        console.log(designs)
        this.firstStudyImages = designs["studyDesign1"].map(item => item.image);
        this.firstStudySentences = designs["studyDesign1"].map(item => item.sentences);

        this.secondStudyImages = designs["studyDesign2"].map(item => item.image);
        this.secondStudySentences = designs["studyDesign2"].map(item => item.sentences);
    }

    getProcedure(isDebug) {
        let procedure = {
            timeline: [instructions.default.getTrial(13, 13),
                (new studySequenceProcedure(this.firstStudyImages, this.firstStudySentences, "female", () => {}, isDebug)).getProcedure(isDebug),
            instructions.default.getTrial(14, 14),
            (new studySequenceProcedure(this.secondStudyImages, this.secondStudySentences, "female", () => {}, isDebug)).getProcedure(),
            instructions.default.getTrial(15, 18),],
            randomize_order: false
        }

        return procedure;
    }
}