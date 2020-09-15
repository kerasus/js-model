window.EventBus = new class {
    constructor() {
        this.Vue = new Vue();
    }

    fire(event, data = null) {
        this.Vue.$emit(event,data);
    }

    listen(event, callback) {
        this.Vue.$on(event,callback);
    }
};
