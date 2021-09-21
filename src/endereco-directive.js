angular.module('endereco',[])
.directive("enderecoModal", function() {
    var ddo = {};

    ddo.restric = "AE";

    ddo.templateUrl = "endereco/endereco-modal.html"
    
    return ddo;
}).directive("enderecoInput", function() {
    var ddo = {};

    ddo.restric = "AE";

    ddo.templateUrl = "endereco/endereco-input.html"
    
    return ddo;
});