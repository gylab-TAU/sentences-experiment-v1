import $ from "jquery";

class httpService {
    static async sendPostRequest(url, body, error, success, contentType) {
        $.ajax({
            type: "POST",
            url: url,
            timeout: 10000,
            data: body,
            success: success,
            error: error,
            contentType: contentType
        });
    }
}

export default httpService;
