class IdFromUrlService { 
    static getId() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        return urlParams.get("subjectID");
    }
}

export default IdFromUrlService;