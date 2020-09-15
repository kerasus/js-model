window.Modal = new class {

    preventCloseModal(modalId) {
        $('#'+modalId).on('hide.bs.modal', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    hide(modalId) {
        $('#'+modalId).off('hide.bs.modal').modal('hide');
    }

    show(modalId, preventCloseModal) {
        $('#'+modalId).modal('show');
        if (typeof preventCloseModal !== 'undefined' && preventCloseModal) {
            this.preventCloseModal(modalId);
        }
    }

};
