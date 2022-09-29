import * as stats from 'simple-statistics';

class conditionAssignmentService {
    static assignConditions(imagePaths) {
        let frontalFaces = imagePaths.filter(path => path.includes("faces/frontal"));
        let faces22 = imagePaths.filter(path => path.includes("faces/22"));
        let faces45 = imagePaths.filter(path => path.includes("faces/45"));
        let invertedFaces = stats.shuffle(imagePaths.filter(path => path.includes("catch-faces")));
        let catchFaces = stats.shuffle(imagePaths.filter(path => path.includes("catch-regular")));

        let neutralSentences = stats.shuffle(imagePaths.filter(path => path.includes("sentences/neutral")));
        let negativeSentences = stats.shuffle(imagePaths.filter(path => path.includes("sentences/negative")));
        
        let catchSentences = stats.shuffle(imagePaths.filter(path => path.includes("catch-images")));
        let catchForInverted = stats.shuffle(imagePaths.filter(path => path.includes("catch-normal")));

        let ids = frontalFaces.map(imageName => this.getId(imageName));

        let neutralIds = stats.shuffle(ids.slice(0, ids.length / 2));
        let negativeIds = stats.shuffle(ids.slice(ids.length / 2, ids.length));

        console.log("8888888888888")
        console.log(neutralIds)
        console.log(negativeIds)
        console.log("8888888888888")

        let oldNeutral = stats.shuffle(neutralIds.slice(0, neutralIds.length / 2 ));
        let oldNegative = stats.shuffle(negativeIds.slice(negativeIds.length / 2 , negativeIds.length ));

        let oldNeutSentences = stats.shuffle(neutralSentences.slice(0, oldNeutral.length));
        let oldNegSentences = stats.shuffle(negativeSentences.slice(0, oldNegative.length));
        let newNeutSentences = stats.shuffle(neutralSentences.slice(oldNeutral.length, neutralSentences.length));
        let newNegSentences = stats.shuffle(negativeSentences.slice(oldNegative.length, negativeSentences.length));

        
        console.log("==========")
        console.log(oldNeutSentences)
        console.log(oldNegSentences)
        console.log(newNeutSentences)
        console.log(newNegSentences)
        console.log("==========")

        let studyPhaseDesign1 = this.getStudyPhase(oldNeutral, oldNegative, frontalFaces, oldNeutSentences, oldNegSentences, invertedFaces, catchFaces, catchForInverted, catchSentences);
        let studyPhaseDesign2 = stats.shuffle(studyPhaseDesign1);
        let testPhaseDesign = this.getTestPhase(neutralIds, negativeIds, newNeutSentences, newNegSentences, frontalFaces, faces22, faces45);

        return {
            "studyDesign1": studyPhaseDesign1,
            "studyDesign2": studyPhaseDesign2,
            "testDesign": testPhaseDesign
        }
    }

    static getTestPhase(neutIds, negIds, neutralSentences, negativeSentences, frontal, angle22, angle45) {
        let design = this.matchFaceToSentence(neutIds, frontal, neutralSentences, false, angle22, angle45).
        concat(this.matchFaceToSentence(negIds, frontal, negativeSentences,  false, angle22, angle45));

        console.log("333333333333333333333")
        console.log(this.matchFaceToSentence(neutIds, frontal, neutralSentences, false, angle22, angle45))
        console.log("333333333333333333")

        return stats.shuffle(design);
    }
    
    static getStudyPhase(neutIds, negIds, faces, neutSentences, negSentences, invertedFaces, catchFaces, catchSentForInverted, catchSentences) {
        let studyPhaseDesign = this.matchFaceToSentence(neutIds, faces, neutSentences, false);
        studyPhaseDesign = studyPhaseDesign.concat(this.matchFaceToSentence(negIds, faces, negSentences, false));
        studyPhaseDesign = studyPhaseDesign.concat(this.matchFaceToSentence(invertedFaces, invertedFaces, catchSentForInverted, true));
        studyPhaseDesign = studyPhaseDesign.concat(this.matchFaceToSentence(catchFaces, catchFaces, catchSentences, true));
        
        return stats.shuffle(studyPhaseDesign);
    }

    static matchFaceToSentence(ids, faceArr, sentenceArr, isCatch, angle1Arr, angle2Arr) {
        // console.log(angle1Arr)
        //console.log(angle2Arr)
        let design = [];
        ids = stats.shuffle(ids);
        sentenceArr = stats.shuffle(sentenceArr);

        for (let i = 0; i < ids.length; i++) {
            let item = {
                image: faceArr.filter(path => path.includes(ids[i]))[0],
                sentences: sentenceArr[i],
                isCatch: isCatch
            }

            // console.log("&&&&&&&&&&&&&&&&")
            // console.log(ids[i])
            // console.log(item)
            // console.log(ids)

            // if(!ids[i]) {
            //     console.log("!!!!!!!!!!!!!")
            //     console.log(i)
            //     console.log("!!!!!!!!!!!!!")
            // }
            // console.log("&&&&&&&&&&&&&&&&")

            if(angle1Arr) {
                let item2 = {
                    image: angle1Arr.filter(path => path.includes(ids[i]))[0],
                    sentences: sentenceArr[i],
                    isCatch: isCatch
                }

                design.push(item2)
            }

            if(angle2Arr) {
                let item3 = {
                    image: angle2Arr.filter(path => path.includes(ids[i]))[0],
                    sentences: sentenceArr[i],
                    isCatch: isCatch
                }

                design.push(item3)
            }

            design.push(item);
        }

        return design;
    }

    static getId(path) {
        let picName = path.split("/").at(-1);

        return picName.split("d")[0];
    }
}

export default conditionAssignmentService;