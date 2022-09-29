import axios from "axios";

class NutellaService {
    static async sendDataToNutella(experimentName, experimenterName, results, participantId) {
        console.log(results)
        let data = {
            "data": {
              "participant_info": {
                "participant_id": participantId,
              },
              "time": Date.now(),
              "headers": [],
              "trials": results.splice(1),
              "experiment_info": {
                "experimenter_name": experimenterName,
                "experiment_name": experimentName
              },
              "others": {}
            }
        }

        console.log(data)

        let success = (res) => {
            console.log(res);
            console.log("nutella succeded");
            
            window.location.replace("http://www.w3schools.com");
        }

        let error = (err) => {
            console.log(err);
        }

        await axios.post("http://178.62.106.190/saveResults/", data).then((res) => {
            success(res);
        }).catch((err) => {
            error(err);
        });
    }
}

export default NutellaService;
