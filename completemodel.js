chatbot.service('completeModel', function (localStorageService, $location) {
    this._completeModel = undefined;
    // this function gets complete model, in case it doesnt find one
    // it tries to retrieve it from local storage, if it fails there also
    // it just redirects to login page
    this.getCompleteModel = function () {
        if (this._completeModel != undefined) {
            localStorageService.set('completeModel', this._completeModel);
            return this._completeModel;
        }
        else {
            var localModel = localStorageService.get('completeModel');
            if (localModel != undefined) {
                this._completeModel = localModel;
                return this._completeModel;
            }
            else {
                $location.path('/login');
            }
        }
    }

    // saves complete model into local storage
    this.setCompleteModel = function (param) {
        this._completeModel = param;
        localStorageService.set('completeModel', param);
    }
}); 
