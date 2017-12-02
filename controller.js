angular.module('chatbot').controller('controller', function ($scope, sharedProperties, $state, $location, completeModel, service, $timeout) {
    $scope.init = function () {
        var model = completeModel.getCompleteModel();
        $scope.pageNumber = 1;
        $scope.defaultPageNumber = sharedProperties.getDefaultPageNumber();
        $scope.itemsPerPage = sharedProperties.getItemsPerPage();
        $scope.total_count = 0;
        $scope.query = {};
        $scope.flag = sharedProperties.getStatusFlag();
        $scope.prettyFlag = sharedProperties.getPrettyFlag();
        $scope.getAllVideo($scope.pageNumber, '');
        console.log("init")

    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


    $scope.getAllMessages = function (page, search) {
        service.getAllMessages({
            pageNumber: page,
            itemsPerPage: $scope.itemsPerPage,
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data !== undefined && response.data.result !== undefined && response.data.result.length > 0) {
                    $scope.totalPages = Math.ceil(response.data.totalLength / $scope.itemsPerPage);
                    $scope.message = response.data.result;
                    $scope.totalCount = response.data.totalCount;
                }
                else {
                    $scope.message = [];
                }
            }
            else {
                $scope.errorSignal("Could not fetch videos. Try again !!!");
            }
        });
    };

    $scope.createMessage = function () {
        console.log("createMessage")
        var status = '';
        var messageObj = {
            id: $scope.messageId,
            content: $scope.messageContent,
            status: status
        }; 
        service.addMessage(messageObj).then(function (response) {
            if (response.status === 200 && response.data.success === true) {
                $scope.getAllMessages($scope.pageNumber, '');
                $scope.successSignal("Successfully added new messages !!!")
                $scope.resetForm();
                console.log(response.data.result);
                $scope.result = response.data.result;
            }

            else {
                $scope.errGenerate(response);
            }
        });

    };



    $scope.deleteMessage = function () {
        var id = $scope.selectedMessage.id;
        adminService.deleteMessage({id: id}).then(function (response) {
            if (response.status === 200) {
                $scope.message.splice($scope.selectedIndex, 1);
                $scope.successSignal("Successfully Deleted  !!!")
            }
            else {
                $scope.errorSignal("Could not Delete. Try again !!!");
            }
        });
    };


    $scope.errorSignal = function (signal) {
        $scope.successMessage = '';
        $scope.errorMessage = signal;
        $scope.alertTimeout('error');
    };

    $scope.successSignal = function (signal) {
        $scope.errorMessage = '';
        $scope.successMessage = signal;
        $scope.alertTimeout('success');
    };
 
    $scope.errGenerate = function (response) {
        var errArr = [];
        for (var i = 0; i < response.data.err.length; i++) {
            errArr[i] = response.data.err[i].msg;
        }
        var errStr = errArr.toString();
        if (!errStr) {
            errStr = "Could Not Perform The Requested Operation!! Try Again";
        }
        $scope.errorSignal(errStr);
    }
})

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);





