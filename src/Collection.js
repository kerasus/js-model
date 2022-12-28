const CRUD = require('./CRUD')

class Collection {

    constructor(data, paginateData) {
        this.list = [];
        this.crud = new CRUD();
        this.loading = false;
        this.paginate = paginateData;
        this.loadBaseRoute();

        if(typeof data !== 'undefined' && data !== null && typeof data.list !== 'undefined' && data.list !== null) {
            data = data.list;
        }

        if (data){
            try {
                this.add(...data);
            } catch(error) {
                console.log('error', error);
                console.log('error constructor.name: ', this.constructor.name);
                console.log('error data: ', data);
            }

        }
    }

    loadBaseRoute() {
        let model = this.model(),
            object = new model();
        if (typeof object !== 'undefined' && typeof object.baseRoute !== 'undefined') {
            this.baseRoute = object.baseRoute;
        } else {
            this.baseRoute = null;
        }
    }

    model() {
        return null;
    }

    add(...data) {
        let that = this;
        this.addItem(...data.map(t => that.addItem(t)));
    }

    addItem(data) {
        if (typeof data === 'undefined') {
            return;
        }
        let model = this.model();
        let object = new model(data);
        this.list.push(object);
    }

    getItem(key, val) {
        return this.list.find(function (item) {
            return (item[key].toString() === val.toString())
        })
    }

    getIndex(key, val) {
        return this.list.findIndex(function (item) {
            return (item[key] === val)
        })
    }

    fetch(data, url) {
        if (typeof url === 'undefined') {
            // url = this.actionUrl;
            url = this.baseRoute;
        }

        if (!url) {
            return new Promise();
        }
        return this.crud.fetch(url, data);
    }

    remove(itemId) {
        const itemIndex = this.list.findIndex(i => (i.id === itemId))
        if (itemIndex !== -1) {
            this.list.splice(itemIndex, 1);
        }
    }

    clear() {
        this.list = [];
    }

    sort(sortFunction) {
        let sortList = Array.prototype.sort.bind(this.list);
        sortList(sortFunction);
    }

    sortByKey(key, sortType) {

        if (typeof sortType === 'undefined') {
            sortType = 'asc'; // asc - des
        }
        this.sort(function ( a, b ) {
            let sorta = a[key],
                sortb = b[key];
            if (sorta < sortb) {
                return (sortType === 'asc') ? -1 : 1;
            }
            if (sorta > sortb) {
                return (sortType === 'asc') ? 1 : -1;
            }
            return 0;
        });
    }

    setEditMode(mode) {
        this.list.forEach(element => element.editMode = mode);
    }
}

module.exports = Collection;
module.exports.default = Collection;
