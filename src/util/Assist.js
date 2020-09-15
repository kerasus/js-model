import * as PersianDate from "persian-date";

class Assist {
    constructor() {}

    static isValidData(data) {
        return (typeof data !== 'undefined' && data !== null && data !== '');
    }

    static optional(data, optionalData, refinementData) {
        if (this.isValidData(data)) {
            if (typeof refinementData === 'function') {
                return refinementData(data);
            } else {
                return data;
            }
        } else {
            if (typeof optionalData !== 'undefined') {
                return optionalData;
            } else {
                return null;
            }
        }
    }

    static miladiToShamsi(miladi) {
        if (miladi) {
            return new PersianDate(new Date(miladi)).format('HH:mm:ss YYYY/MM/DD');
        } else {
            return null;
        }
    }

    static diffDate(date1, date2, diffType) {
        let a = new PersianDate(new Date(date1)),
            b = new PersianDate(new Date(date2));
        return a.diff(b, diffType)
    }

    static relatedModelId(model, relatedModelName) {
        model[relatedModelName+'_id'] = model[relatedModelName].id;
    }

    static bufferNewData(item, props) {
        for (let i = 0; typeof props[i] !== 'undefined'; i++) {
            item[props[i] + '_updated'] = item[props[i]];
        }
    }

    static applyNewData(item, props) {
        for (let i = 0; typeof props[i] !== 'undefined'; i++) {
            item[props[i] + '_old'] = item[props[i]];
            item[props[i]] = item[props[i] + '_updated'];
        }
    }

    static revertToOldData(item, props) {
        for (let i = 0; typeof props[i] !== 'undefined'; i++) {
            item[props[i]] = item[props[i] + '_old'];
            item[props[i] + '_updated'] = null;
        }
    }


    static getErrors(errors) {
        let errorsArray = [];

        for (let prop in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, prop)) {
                for (let i = 0; typeof errors[prop][i] !== 'undefined'; i++) {
                    errorsArray.push(errors[prop][i]);
                }
            }
        }

        return errorsArray;
    }

    static handleErrorMessage(error) {
        if (error.response) {
            if(error.response.status === 422) {
                let errorsArray = Assist.getErrors(error.response.data.errors);
                for (let i = 0; (typeof errorsArray[i] !== 'undefined'); i++) {
                    toastr.error(errorsArray[i]);
                }
            } else if(error.response.status === 413) {
                toastr.error('حجم فایل زیاد می باشد.');
            } else {
                toastr.error(error.response.data.message);
            }
        } else {
            console.log('error', error);
            toastr.error(error.message);
        }
    }

    static stringContain(search, string) {
        if (typeof search === 'undefined' || search === null || search.trim().length === 0) {
            return true;
        }

        let filterWords = search.split(' ');
        for (let i = 0; typeof filterWords[i] !== 'undefined'; i++) {
            let exp = '^.*('+filterWords[i]+')+.*$',
                patt = new RegExp(exp);
            if (!patt.test(string)) {
                return false;
            }
        }

        return true;
    }
}
export default Assist;
