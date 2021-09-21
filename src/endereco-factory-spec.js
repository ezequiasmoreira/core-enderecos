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