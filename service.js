chatbot.service('service', ['sharedProperties', '$http', function (sharedProperties, $http) {

    this.getAllMessages = function (requestData) {
        return $http({
            method: "GET",
            url: sharedProperties.getUrl() + '/first',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (response) {
            return response;
        }).error(function (response) {
            return response;
        });


    };

    this.addMessage = function (requestData) {
        console.log("here")
        return $http({
            method: "POST",
            url: sharedProperties.getUrl() + '/first',
            headers: {
                'Content-type': 'application/json'
            },
            data: requestData
        }).success(function (response) {
            return response;
        }).error(function (response) {
            return response;
        });
    };


   
    this.deleteMessage = function (requestData) {
        return $http({
            method: "DELETE",
            url: sharedProperties.getUrl() + '/first' + requestData.id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestData
        }).success(function (response) {
            return response;
        }).error(function (response) {
            return response;
        });
    };

}]);