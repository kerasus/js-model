import CRUD from './CRUD'

class Collection {

    constructor(data) {
        this.list = [];
        this.crud = new CRUD();
        this.loading = false;
        this.baseRoute();

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

    baseRoute() {
        let model = this.model(),
            object = new model();
        if (typeof object.baseRoute !== 'undefined') {
            this.baseRoute = object.baseRoute;
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

    removeItems (...index) {
        let that = this
        this.removeItem(...index.map(t => that.removeItem(t)))
    }

    removeItem (index) {
        this.list.splice(index, 1)
    }

    getItem(key, val) {
        return this.list.find(function (item) {
            return (item[key] === val)
        })
    }

    fetch(data, url) {
        if (typeof url === 'undefined') {
            // url = this.actionUrl;
            url = this.baseRoute;
        }
        return this.crud.fetch(url, data);
    }

    remove(itemId) {
        for (let i = 0; typeof this.list[i] !== 'undefined'; i++) {
            if (this.list[i].id === itemId) {
                this.list.splice(i, 1);
            }
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
export default Collection;
