import InstructionsPlugin from "@jspsych/plugin-instructions";

class instructionsComponent {
    static getTrial(start, stop) {
        let pages = this.getImageTags(start, stop);

        let trial = {
            type: InstructionsPlugin,
            pages: pages,
            show_clickable_nav: true,
            allow_backward: false,
            button_label_next: "המשך"
        }

        return trial;
    }

    static getImageTags(start, stop) {
        let tagsArray = [];
        
        for (let i = start; i <= stop; i++) {
            tagsArray.push('<img src="media/images/instructions/Slide' + i + '.JPG" style="max-width:' + window.screen.availWidth + "px; max-height:" + (window.screen.availHeight - 50) +  'px;">');
        }

        return tagsArray;
    }
}

export default instructionsComponent;