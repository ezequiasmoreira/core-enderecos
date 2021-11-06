
    'use strict';
        
    angular.module('endereco',[])
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
