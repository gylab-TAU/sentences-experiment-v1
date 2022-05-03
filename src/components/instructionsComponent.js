import InstructionsPlugin from "@jspsych/plugin-instructions";

class instructionsComponent {
    static getTrial() {
        let pages = this.getImageTags();

        let trial = {
            type: InstructionsPlugin,
            pages: pages,
            show_clickable_nav: true,
            allow_backward: false,
            button_label_next: "המשך"
        }

        return trial;
    }

    static getImageTags() {
        let tagsArray = [];
        
        for (let i = 1; i <= 3; i++) {
            tagsArray.push('<img src="media/images/instructions/instructions' + i + '.png" style="max-width:' + window.screen.availWidth + "px; max-height:" + (window.screen.availHeight - 50) +  'px;">');
        }

        return tagsArray;
    }
}

export default instructionsComponent;