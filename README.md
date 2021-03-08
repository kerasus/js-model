# js-abstract-model

Data model for javascript

## Install

    npm install js-abstract-model --save

## Usage

### create model files

something like this:

models/Gender.js
    
    class Gender extends Model {
        constructor(data) {
            super(data, [
                {key: 'id'},
                {key: 'name'}
            ]);
        }
        
        isMale () {
            return this.name === 'male'
        }
    }
    export default Gender;
    
models/User.js

    import Gender from './Gender';
    
    class User extends Model {
        constructor(data) {
            super(data, [
                {key: 'baseRoute'}, // base Api address for CURD
                {key: 'id'},
                {key: 'first_name',
                    default: function (itemVal, inputData) {
                        if (typeof inputData.first_name !== 'undefined' && inputData.first_name !== null) {
                            return inputData.first_name;
                        } else if (typeof inputData.firstName !== 'undefined' && inputData.firstName !== null) {
                            return inputData.firstName;
                        }
                    }
                },
                {key: 'last_name',
                    default: function (itemVal, inputData) {
                        if (typeof inputData.last_name !== 'undefined' && inputData.last_name !== null) {
                            return inputData.last_name;
                        } else if (typeof inputData.lastName !== 'undefined' && inputData.lastName !== null) {
                            return inputData.lastName;
                        }
                    }
                },
                {key: 'mobile'},
                {key: 'email'},
                {key: 'province'},
                {key: 'city'},
                {key: 'role'},
                {key: 'created_at'},
                {key: 'updated_at'},
                {
                    key: 'photo',
                    default: 'default_photo_address_for_null_value'
                },
                {
                    key: 'gender',
                    relatedModel: Gender,
                }
            ]);
    
            // (optional)
            // you can customise sent data with set apiResource
            let that = this;
            this.apiResource = {
                fields: [
                    {key: 'id'},
                    {
                        key: 'firstName',
                        value: function () {
                            return that.first_name;
                        }
                    },
                    {
                        key: 'lastName',
                        value: function () {
                            return that.last_name;
                        }
                    },
                    {key: 'email'},
                    {key: 'province'},
                    {key: 'city'},
                    {
                        key: 'gender_id',
                        value: function () {
                            return that.gender.id;
                        }
                    }
                ]
            };
        }
    }
    
    class UserList extends Collection {
        model() {
            return User;
        }
    }
    
    export {User, UserList};

in component: 


    // send user data to server to crate new user
    var user = new User({
        first_name: 'john',
        last_name: 'doe',
        gender: {
            id: 1,
            name: 'male'
        }
    });
    user.create()
    .then(function(responce){
        // do something with responce
    })
    .catch(function(error){
        // error ...
    })
   
    // use nested models
    user.gender.isMale() // true
    
    // send user data to server to update user data
    var user = new User({
        id: 1,
        first_name: 'john',
        last_name: 'doe',
        gender: {
            id: 1,
            name: 'male'
        }
    });
    user.update() // return promise


## Author

[kerasus](https://github.com/kerasus/)


## License

MIT
editable polyline plugin extension for vue2-leaflet package
