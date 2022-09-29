import * as instructions from "../components/instructionsComponent";
import { studySequenceProcedure } from "../procedures/studySequenceProcedure";
import { testSequenceProcedure } from "../procedures/testPhaseProcedure"; 

export class practicePhaseProcedure {
    constructor(imagePaths) {
        this.images = imagePaths.filter(path => path.includes("media/images/stimuli/faces/practice/frontal"));
        this.catchFace = imagePaths.filter(path => path.includes("media/images/stimuli/faces/practice/04739d205"));
        this.testSentences = imagePaths.filter(path => path.includes("media/images/stimuli/sentences/practice/prac-test"));
        this.studytSentences = imagePaths.filter(path => path.includes("media/images/stimuli/sentences/practice/prac") && !path.includes("test") && !path.includes("prac-"));
        this.catchSentence = imagePaths.filter(path => path.includes("media/images/stimuli/sentences/practice/prac-catch"));
    }

    getProcedure() {
        let studyPhaseimages = [...this.images].filter((item, index) => index < this.images.length / 2);
        studyPhaseimages.unshift(this.catchFace[0]);
        
        let studyPhaseSentences = [...this.studytSentences];
        studyPhaseSentences.push(this.catchSentence[0]);

        let testImages = [...this.images].filter((item, index) => index != studyPhaseimages.length);
        let allSentences = [...this.studytSentences].concat(this.testSentences);

        let procedure = {
            timeline: [(new studySequenceProcedure(studyPhaseimages, studyPhaseSentences, "male", true)).getProcedure(),
            instructions.default.getTrial(11, 11),
            (new testSequenceProcedure(testImages, allSentences, "male").getProcedure()),
            instructions.default.getTrial(12, 12),],
            randomize_order: false
        }

        return procedure;
    }
}