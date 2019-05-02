import utils from "./utils.js";
import noteDetailService from "./note_detail.js";
import infoService from "./info.js";
import server from "./server.js";

class NoteDetailImage {
    /**
     * @param {NoteContext} ctx
     */
    constructor(ctx) {
        this.$component = ctx.$noteTabContent.find('.note-detail-image');
        this.$imageWrapper = ctx.$noteTabContent.find('.note-detail-image-wrapper');
        this.$imageView = ctx.$noteTabContent.find('.note-detail-image-view');
        this.$copyToClipboardButton = ctx.$noteTabContent.find(".image-copy-to-clipboard");
        this.$fileName = ctx.$noteTabContent.find(".image-filename");
        this.$fileType = ctx.$noteTabContent.find(".image-filetype");
        this.$fileSize = ctx.$noteTabContent.find(".image-filesize");

        this.$imageDownloadButton = ctx.$noteTabContent.find(".image-download");
        this.$imageDownloadButton.click(() => utils.download(this.getFileUrl()));

        this.$copyToClipboardButton.click(() => {
            this.$imageWrapper.attr('contenteditable','true');

            try {
                this.selectImage(this.$imageWrapper.get(0));

                const success = document.execCommand('copy');

                if (success) {
                    infoService.showMessage("Image copied to the clipboard");
                }
                else {
                    infoService.showAndLogError("Could not copy the image to clipboard.");
                }
            }
            finally {
                window.getSelection().removeAllRanges();
                this.$imageWrapper.removeAttr('contenteditable');
            }
        });
    }

    async show() {
        const activeNote = noteDetailService.getActiveNote();

        const attributes = await server.get('notes/' + activeNote.noteId + '/attributes');
        const attributeMap = utils.toObject(attributes, l => [l.name, l.value]);

        this.$component.show();

        this.$fileName.text(attributeMap.originalFileName || "?");
        this.$fileSize.text((attributeMap.fileSize || "?") + " bytes");
        this.$fileType.text(activeNote.mime);

        this.$imageView.prop("src", `api/images/${activeNote.noteId}/${activeNote.title}`);
    }

    selectImage(element) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    getFileUrl() {
        // electron needs absolute URL so we extract current host, port, protocol
        return utils.getHost() + "/api/notes/" + noteDetailService.getActiveNoteId() + "/download";
    }

    getContent() {}

    focus() {}

    onNoteChange() {}

    cleanup() {}

    scrollToTop() {
        this.$component.scrollTop(0);
    }
}

export default NoteDetailImage