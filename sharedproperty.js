chatbot.service('sharedProperties', ['ENV', function (ENV) {
    this.url = ENV.apiEndpoint;
    this.roles = {
        "SUPERADMIN": "superadmin",
        "ADMIN": "admin",
        "SHOP_ADMIN": "shopadmin",
        "SHOP_KEEPER": "shopkeeper",
        "CONSUMER": "consumer"
    }

    this.flag = {
        UNPUBLISH: '0',
        PUBLISH: '1',
        APPROVE: '2',
        REJECT: '3',
        DELETE: '4'
    };

    this.prettyFlag = {
        '0': 'unpublish',
        '1': 'publish',
        '2': 'approve',
        '3': 'reject',
        '4': 'delete'
    }

    this.defaultImage = "images/default.png";
    this.itemsPerPage = 50;
    this.defaultPageNumber = 1;
    this.maxPages = 10;
    this.location = {
        defaultLat: 30.668834,
        defaultLon: 76.729575
    };


    this.getUrl = function () {
        return this.url;
    };

    this.getRoles = function () {
        return this.roles;
    }

    this.getItemsPerPage = function () {
        return this.itemsPerPage;
    };

    this.getMaxPages = function () {
        return this.maxPages;
    };

    this.getStatusFlag = function () {
        return this.flag;
    };

    this.getPrettyFlag = function () {
        return this.prettyFlag;
    };
    this.getDefaultImage = function () {
        return this.defaultImage;
    };
    this.getDefaultLocation = function () {
        return this.location;
    };
    this.getDefaultPageNumber = function (){
      return this.defaultPageNumber;
    };
}]);
