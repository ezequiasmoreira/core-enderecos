(function () {
    'use strict';

    angular.module('componentes')
    .directive('enderecoModal', function() {
        var ddo = {};

        ddo.restric = 'AE';

        ddo.templateUrl = 'bower_components/core-enderecos/src/endereco-modal.html';
        
        return ddo;
    }).directive('enderecoInput', function() {
        var ddo = {};

        ddo.restric = 'AE';

        ddo.templateUrl = 'bower_components/core-enderecos/src/endereco-input.html';
        
        return ddo;
    });
}());   