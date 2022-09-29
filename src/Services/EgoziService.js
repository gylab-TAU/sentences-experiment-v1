import httpService from "./httpService";
import NutellaService from "./NutellaService";

class EgoziService {
    static async sendDataToEgozi(experimentName, experimenterName, results, participantId, timeline, redirect) {
        console.log(results)
        let tempArr = [];

        for (var i = 0; i < results.length; i++) {
            tempArr.push(JSON.stringify(results[i]));
        }
        let data = {
            "action": 'insertExperimentResultsToDb',
            "experimentName": experimentName,
            "experimenterName": experimenterName,
            "subjectId": participantId,
            "results": results
        }
        
        let success = (res) => {
            console.log("egozi succeded");

            NutellaService.sendDataToNutella(experimentName, experimenterName, results, participantId)
        }

        let error = (err) => {
            console.log(err); 

        }

        console.log("^^^^^^^^^^^")
        console.log(data)
        console.log("^^^^^^^^^^^^^0")

        await httpService.sendPostRequest("http://egozi.tau.ac.il/experiments/router.php", data, error, success);   
    }
}

export default EgoziService;
