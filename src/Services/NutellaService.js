import axios from "axios";

class NutellaService {
    static sendDataToNutella(experimentName, experimenterName, results, participantId) {
        let data = {
            "data": {
              "participant_info": {
                "participant_id": participantId,
              },
              "time": Date.now(),
              "headers": [],
              "trials": results.slice(1),
              "experiment_info": {
                "experimenter_name": experimenterName,
                "experiment_name": experimentName
              },
              "others": {}
            }
        }

        let success = (res) => {
            console.log(res);
            console.log("nutella succeded");
        }

        let error = (err) => {
            console.log(err);
        }

        axios.post("http://178.62.106.190/saveResults/", data).then((res) => {
            success(res);
        }).catch((err) => {
            error(err);
        });
    }
}

export default NutellaService;
