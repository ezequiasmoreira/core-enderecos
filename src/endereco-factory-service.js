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