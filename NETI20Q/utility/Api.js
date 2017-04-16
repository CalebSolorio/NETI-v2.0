var Api = {
    getDrugs(){
        var url = 'https://neti-v2.firebaseio.com/drug.json';
        return fetch(url).then((res) => res.json());
    },

    getConsistencies(){
        var url = 'https://neti-v2.firebaseio.com/consistency.json';
        return fetch(url).then((res) => res.json());
    },

    getColors(){
            var url = 'https://neti-v2.firebaseio.com/color.json';
            return fetch(url).then((res) => res.json());
    },

    getContainers(){
        var url = 'https://neti-v2.firebaseio.com/container.json';
        return fetch(url).then((res) => res.json());
    },
};

module.exports = Api;

/*
for(var k in obj) console.log(obj[k]);
*/