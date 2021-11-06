angular.module("projetoTecnico").factory("enderecoFactorySpec", function () {

	var _validarEnderecoPrincipal = function (enderecos) {
		var principal = false;
		enderecos.filter(function(endereco){
            if(endereco.principal == true){
                principal = true;
            }
        });       
		if (!principal) throw "Endereço principal não definido"
		return true;
	};

	var _validarEndereco = function (endereco) {		
		if (!endereco.descricao) throw "Descrição obrigatório.";
		if (!endereco.logradouro) throw "Logradouro obrigatório";
		if (!endereco.numero) throw "Número obrigatório";
		if (!endereco.complemento) throw "Complemento obrigatório";
		if (!endereco.bairro) throw "Bairro obrigatório";
		if (!endereco.cep) throw "Cep obrigatório";
		return true;
	};

	return {
		validarEndereco: _validarEndereco,
		validarEnderecoPrincipal: _validarEnderecoPrincipal
	};
});
angular.module("projetoTecnico").factory("enderecoFactoryService", function ($http,config) {

    var _new = function (endereco) {  
        var novoEndereco        = {};
        novoEndereco.id         = endereco.id;
        novoEndereco.descricao  = endereco.descricao;
        novoEndereco.numero     = endereco.numero;
        novoEndereco.logradouro = endereco.logradouro;
        novoEndereco.complemento= endereco.complemento;
        novoEndereco.cep        = endereco.cep;
        novoEndereco.bairro     = endereco.bairro;
        novoEndereco.cidade     = endereco.cidade;
        novoEndereco.cidadeId   = endereco.cidadeId > 0 ? endereco.cidadeId : endereco.cidade.id;
        novoEndereco.estadoId   = endereco.estadoId > 0 ? endereco.estadoId : endereco.cidade.estado.id;
        novoEndereco.principal  = endereco.principal ? true : false;
        return novoEndereco;  	
    };

    var _excluirEndereco = function (enderecos,enderecoExcluir) {  
        return enderecos.filter(function(endereco){
            if(endereco.$$hashKey != enderecoExcluir.$$hashKey){
                return endereco;
            }
        });           	
    };

    var _editarEndereco = function ($scope,endereco) { 
        $scope.endereco={}; 
        $scope.endereco.id          = endereco.id;
        $scope.endereco.descricao   = endereco.descricao;
        $scope.endereco.numero      = endereco.numero;
        $scope.endereco.logradouro  = endereco.logradouro;
        $scope.endereco.complemento = endereco.complemento;
        $scope.endereco.cep         = endereco.cep;
        $scope.endereco.bairro      = endereco.bairro;
        $scope.endereco.cidade      = endereco.cidade;
        $scope.endereco.estadoId    = endereco.estadoId > 0 ? endereco.estadoId : endereco.cidade.estado.id;
        _popularCidadesPorEstado($scope.endereco.estadoId,$scope); 
        $scope.endereco.cidadeId    = endereco.cidadeId > 0 ? endereco.cidadeId : endereco.cidade.id;      
        $scope.endereco.principal   = endereco.principal;
        $scope.endereco.$$hashKey   = endereco.$$hashKey;      	
    };

    var _configurarEnderecoPrincipal = function ($scope,enderecoParaSalvar) {  
        if(!enderecoParaSalvar.principal){
            return true;
        }
        $scope.enderecos = $scope.enderecos.filter(function(endereco){
            if(endereco.$$hashKey != enderecoParaSalvar.$$hashKey){
                endereco.principal = false;
            }
            return _new(endereco);
        });           	
    };

    var _popularEstados = function ($scope) {       
        $http.get(config.baseUrl + '/enderecos').then(success);
        function success(response){ 
            $scope.estados = response.data           
        }
        return true;                   	
    };

    var _popularCidadesPorEstado = function (estadoId,$scope) {      
        $http.get(config.baseUrl + '/enderecos/' + estadoId +'/cidades').then(success);
        function success(response){ 
            $scope.cidades = response.data           
        }
        return true;                   	          	
    };

    return {
            new: _new,
            excluirEndereco: _excluirEndereco,
            editarEndereco: _editarEndereco,
            configurarEnderecoPrincipal: _configurarEnderecoPrincipal,
            popularEstados: _popularEstados,
            popularCidadesPorEstado: _popularCidadesPorEstado
    };
});

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

angular.module("endereco").run(["$templateCache", function($templateCache) {$templateCache.put("endereco-input.html","<label for=\"endereco\">Endereços&nbsp;<span class=\"glyphicon glyphicon-plus botao-adicionar\" data-target=\"#modalEndereco\" data-toggle=\"modal\"></span></label><ul class=\"list-group\"><li class=\"list-group-item\">&nbsp; <span class=\"btn btn-sm\" ng-repeat=\"endereco in enderecos\"><button type=\"text\" class=\"btn\" ng-click=\"editarEndereco(endereco)\" ng-class=\"{enderecoPrincipal:endereco.principal}\">{{endereco.descricao}}</button><span ng-click=\"excluirEndereco(endereco)\" class=\"glyphicon glyphicon-remove\"></span></span></li></ul><figcaption class=\"figure-caption\"><span class=\"legenda\">&nbsp;&nbsp;&nbsp;</span>&nbsp;Principal.</figcaption>");
$templateCache.put("endereco-modal.html","<div class=\"modal fade\" id=\"modalEndereco\" tabindex=\"-2\" role=\"dialog\" aria-hidden=\"true\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Endereço</h5><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div><div><form novalidate=\"\" name=\"formulario-endereco\"><input type=\"hidden\" ng-model=\"endereco.id\" class=\"form-control\" id=\"id\"><div class=\"col-md-12 modalEnderecoCabecalho\"><div class=\"form-group col-md-6\"><label for=\"enderecoDescricao\" class=\"col-form-label\">Descrição</label> <input type=\"text\" ng-model=\"endereco.descricao\" class=\"form-control\" id=\"enderecoDescricao\"></div><div class=\"form-group col-md-6\"><label for=\"logradouro\" class=\"col-form-label\">Logradouro</label> <input type=\"text\" ng-model=\"endereco.logradouro\" class=\"form-control\" id=\"logradouro\"></div><div class=\"form-group col-md-6\"><label for=\"numero\" class=\"col-form-label\">Número</label> <input type=\"text\" ng-model=\"endereco.numero\" class=\"form-control\" id=\"numero\"></div><div class=\"form-group col-md-6\"><label for=\"complemento\" class=\"col-form-label\">Complemento</label> <input type=\"text\" ng-model=\"endereco.complemento\" class=\"form-control\" id=\"complemento\"></div><div class=\"form-group col-md-6\"><label for=\"bairro\" class=\"col-form-label\">Bairro</label> <input type=\"text\" ng-model=\"endereco.bairro\" class=\"form-control\" id=\"bairro\"></div><div class=\"form-group col-md-6\"><label for=\"cep\" class=\"col-form-label\">Cep</label> <input type=\"text\" ng-model=\"endereco.cep\" class=\"form-control\" id=\"cep\"></div><div class=\"form-group col-md-6\"><label>Estado</label><select name=\"endereco.estado\" class=\"form-control\" ng-change=\"popularCidades(endereco.estadoId)\" ng-model=\"endereco.estadoId\" ng-options=\"estado.id as (estado.nome| uppercase) for estado in estados\"><option selected=\"\" value=\"\">SELECIONE UM ESTADO</option></select></div><div class=\"form-group col-md-6\"><label>Cidade</label><select name=\"endereco.cidade\" class=\"form-control\" ng-model=\"endereco.cidadeId\" ng-options=\"cidade.id as (cidade.nome| uppercase) for cidade in cidades\"><option selected=\"\" value=\"\">SELECIONE UMA CIDADE</option></select></div><div class=\"form-group col-md-6\"><input type=\"checkbox\" ng-model=\"endereco.principal\" class=\"form-check-input\" id=\"principal\"> <label class=\"form-check-label\" for=\"principal\">Endereço principal</label></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"salvarEndereco(endereco)\">Salvar</button></div></form></div></div></div></div>");}]);