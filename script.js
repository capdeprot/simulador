document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            calculate();
            event.preventDefault();
        }
    });
});

function changeLabel() {
    // Limpar todos os campos
    document.getElementById('area').value = '';
    document.getElementById('areaConstruida').value = '';
    document.getElementById('quantidadeUnidades').value = '1';
    
    // Limpar campos da reforma
    document.getElementById('areaTotalUso').value = '';
    document.getElementById('areaTotalReformar').value = '';
    document.getElementById('areaTotalRegularizar').value = '';
    document.getElementById('areaTotalConstruir').value = '';
    
    // Limpar campos do projeto modificativo de reforma
    document.getElementById('areaConstruirAprovado').value = '';
    document.getElementById('areaReformarAprovado').value = '';
    document.getElementById('areaRegularizarAprovado').value = '';
    document.getElementById('areaTotalAprovado').value = '';
    document.getElementById('areaConstruirModificativo').value = '';
    document.getElementById('areaReformarModificativo').value = '';
    document.getElementById('areaRegularizarModificativo').value = '';
    document.getElementById('areaTotalModificativo').value = '';
    
    document.getElementById('resultado').textContent = '';
    
    var assunto = document.getElementById('assunto').value;
    var areaLabel = document.getElementById('areaLabel');
    var areaStandardContainer = document.getElementById('areaStandardContainer');
    var areaConstruidaContainer = document.getElementById('areaConstruidaContainer');
    var reformaContainer = document.getElementById('reformaContainer');
    var quantidadeUnidadesContainer = document.getElementById('quantidadeUnidadesContainer');
    var projetoModificativoContainer = document.getElementById('projetoModificativoReformaContainer');

    // Ocultar todos os containers primeiro
    areaStandardContainer.style.display = 'none';
    areaConstruidaContainer.style.display = 'none';
    reformaContainer.style.display = 'none';
    quantidadeUnidadesContainer.style.display = 'none';
    projetoModificativoContainer.style.display = 'none';

    switch (assunto) {
        case 'reforma':
            reformaContainer.style.display = 'block';
            break;

        case 'projeto_modificativo_edificacao':
            areaConstruidaContainer.style.display = 'block';
            areaStandardContainer.style.display = 'block';
            document.querySelector('#areaConstruidaContainer label').textContent = 'Área total construída no alvará (m²):';
            areaLabel.textContent = 'Área total na planta do Projeto Modificativo (m²):';
            break;
            
        case 'projeto_modificativo_reforma':
            projetoModificativoContainer.style.display = 'block';
            break;

        case 'edificacao_nova':
            areaStandardContainer.style.display = 'block';
            areaLabel.textContent = 'Área a construir (m²):';
            break;

        case 'avanco_grua':
        case 'tapume':
            areaStandardContainer.style.display = 'block';
            quantidadeUnidadesContainer.style.display = 'block';
            areaLabel.textContent = 'Informe a área construída em m²:';
            break;

        case 'tanques_bombas':
            areaStandardContainer.style.display = 'block';
            areaLabel.textContent = 'Informe a quantidade de equipamentos:';
            break;

        case 'acessibilidade':
        case 'sistema_seguranca':
        case 'certificado_seguranca':
            areaStandardContainer.style.display = 'block';
            areaConstruidaContainer.style.display = 'block';
            areaLabel.textContent = 'Área objeto do pedido (m²):';
            document.querySelector('#areaConstruidaContainer label').textContent = 'Área total construída (m²):';
            break;

        default:
            areaStandardContainer.style.display = 'block';
            areaLabel.textContent = 'Área objeto do pedido (m²):';
            break;
    }
}

function calculate() {
    var assunto = document.getElementById('assunto').value;

    if (!assunto) {
        alert("Por favor, selecione uma opção válida.");
        return;
    }

    var resultado = document.getElementById('resultado');
    var valor;

    // Função auxiliar para validar campos obrigatórios
    function validateRequired(value, fieldName) {
        if (value === '' || isNaN(parseFloat(value))) {
            alert("Por favor, informe " + fieldName);
            return false;
        }
        return true;
    }

    // Função auxiliar para campos opcionais
    function parseOptional(value) {
        return value === '' ? 0 : parseFloat(value);
    }

    switch (assunto) {
        case 'edificacao_nova':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área a construir')) return;
            area = parseFloat(area);
            
            if (area <= 1500) {
                valor = area * 6.97;
            } else if (area <= 20000) {
                valor = area * 9.31;
            } else {
                valor = area * 12.41;
            }
            break;

        case 'reforma':
            // Obter valores dos campos específicos da reforma
            var areaTotalUso = document.getElementById('areaTotalUso').value;
            var areaTotalReformar = document.getElementById('areaTotalReformar').value;
            var areaTotalRegularizar = document.getElementById('areaTotalRegularizar').value;
            var areaTotalConstruir = document.getElementById('areaTotalConstruir').value;
            
            // Validar campo obrigatório
            if (!validateRequired(areaTotalUso, 'a Área Total referente ao uso indicado')) return;
            
            // Converter valores
            areaTotalUso = parseFloat(areaTotalUso);
            areaTotalReformar = parseOptional(areaTotalReformar);
            areaTotalRegularizar = parseOptional(areaTotalRegularizar);
            areaTotalConstruir = parseOptional(areaTotalConstruir);
            
            if (areaTotalUso <= 1500) {
                valor = (areaTotalReformar * 6.97) + (areaTotalRegularizar * 6.19) + (areaTotalConstruir * 6.97);
            } else if (areaTotalUso <= 20000) {
                valor = (areaTotalReformar * 9.31) + (areaTotalRegularizar * 9.31) + (areaTotalConstruir * 9.31);
            } else {
                valor = (areaTotalReformar * 12.41) + (areaTotalRegularizar * 12.41) + (areaTotalConstruir * 12.41);
            }
            
            break;

        case 'projeto_modificativo_edificacao':
            var area = document.getElementById('area').value;
            var areaConstruida = document.getElementById('areaConstruida').value;
            
            if (!validateRequired(area, 'a área total na planta do Projeto Modificativo')) return;
            if (!validateRequired(areaConstruida, 'a área total construída no alvará')) return;
            
            area = parseFloat(area);
            areaConstruida = parseFloat(areaConstruida);
            
            if (area <= 1500) {
              if (area <= areaConstruida) {
                valor = area * 3.89;
              } else {
                valor = (area - areaConstruida) * 6.97 + (areaConstruida * 3.89);
              }
            } else if (area <= 20000) {
                if (area <= areaConstruida) {
                valor = area * 4.66;
              } else {
                valor = (area - areaConstruida) * 9.31 + (areaConstruida * 4.66);
              }
            } else {
                if (area <= areaConstruida) {
                valor = area * 6.19;
              } else {
                valor = (area - areaConstruida) * 12.41 + (areaConstruida * 6.19);
              }
            }
            break;

        case 'projeto_modificativo_reforma':
            // Obter valores dos campos
            var areaConstruirAprovado = document.getElementById('areaConstruirAprovado').value;
            var areaReformarAprovado = document.getElementById('areaReformarAprovado').value;
            var areaTotalAprovado = document.getElementById('areaTotalAprovado').value;
            var areaConstruirModificativo = document.getElementById('areaConstruirModificativo').value;
            var areaReformarModificativo = document.getElementById('areaReformarModificativo').value;
            var areaTotalModificativo = document.getElementById('areaTotalModificativo').value;
            
            // Validar campos obrigatórios
            if (!validateRequired(areaConstruirAprovado, 'a área a construir do projeto aprovado')) return;
            if (!validateRequired(areaReformarAprovado, 'a área a reformar do projeto aprovado')) return;
            if (!validateRequired(areaTotalAprovado, 'a área total do projeto aprovado')) return;
            if (!validateRequired(areaConstruirModificativo, 'a área a construir do projeto modificativo')) return;
            if (!validateRequired(areaReformarModificativo, 'a área a reformar do projeto modificativo')) return;
            if (!validateRequired(areaTotalModificativo, 'a área total do projeto modificativo')) return;
            
            // Converter valores
            areaConstruirAprovado = parseFloat(areaConstruirAprovado);
            areaReformarAprovado = parseFloat(areaReformarAprovado);
            areaTotalAprovado = parseFloat(areaTotalAprovado);
            areaConstruirModificativo = parseFloat(areaConstruirModificativo);
            areaReformarModificativo = parseFloat(areaReformarModificativo);
            areaTotalModificativo = parseFloat(areaTotalModificativo);
            
            // Campos opcionais (área a regularizar)
            var areaRegularizarAprovado = parseOptional(document.getElementById('areaRegularizarAprovado').value);
            var areaRegularizarModificativo = parseOptional(document.getElementById('areaRegularizarModificativo').value);
            
            // Calcular diferenças nas áreas a construir, reformar e regularizar
            var diferencaConstruir = Math.max(0, areaConstruirModificativo - areaConstruirAprovado);
            var diferencaReformar = Math.max(0, areaReformarModificativo - areaReformarAprovado);
            var diferencaRegularizar = Math.max(0, areaRegularizarModificativo - areaRegularizarAprovado);
            var areaModificada;
            
            if (areaTotalModificativo <= areaTotalAprovado){
                areaModificada = areaTotalAprovado - areaTotalModificativo;
            } else {
                areaModificada = areaTotalModificativo - areaTotalAprovado;
            }
            
            if (areaTotalModificativo <= 1500) {
                areaModificada = areaModificada * 1.55;
                diferencaConstruir = diferencaConstruir * 6.97;
                diferencaReformar = diferencaReformar * 6.97;
                diferencaRegularizar = diferencaRegularizar * 6.19;
            } else if (areaTotalModificativo <= 20000){
                areaModificada = areaModificada * 3.11;
                diferencaConstruir = diferencaConstruir * 9.31;
                diferencaReformar = diferencaReformar * 9.31;
                diferencaRegularizar = diferencaRegularizar * 9.31;
            } else {
                areaModificada = areaModificada * 4.66;
                diferencaConstruir = diferencaConstruir * 12.41;
                diferencaReformar = diferencaReformar * 12.41;
                diferencaRegularizar = diferencaRegularizar * 12.41;
            }

            valor = (areaModificada + diferencaConstruir + diferencaReformar + diferencaRegularizar);
            break;

        case 'avanco_grua':
        case 'tapume':
            var area = parseFloat(document.getElementById('area').value);
            var quantidadeUnidades = parseFloat(document.getElementById('quantidadeUnidades').value);
            
            if (area <= 1500) {
                valor = 1085.23 * quantidadeUnidades;
            } else if (area > 1500) {
                valor = 2170.51 * quantidadeUnidades;
            } else {
                valor = 0;
            }
            break;

        case 'alvara_heliponto':
            valor = 2260.00;
            break;

        case 'execucao_erb':
            valor = 250.00;
            break;

        case 'estande_vendas':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 3.11;
            break;

        case 'acessibilidade':
            var area = document.getElementById('area').value;
            var areaConstruida = document.getElementById('areaConstruida').value;
            
            if (!validateRequired(area, 'a área objeto do pedido')) return;
            if (!validateRequired(areaConstruida, 'a área total construída')) return;
            
            area = parseFloat(area);
            areaConstruida = parseFloat(areaConstruida);
            
            if (areaConstruida <= 1500) {
                valor = area * 3.11;
            } else if (areaConstruida <= 20000) {
                valor = area * 4.66;
            } else if (areaConstruida > 20000) {
                valor = area * 6.19;
            } else {
                valor = 0;
            }
            break;

        case 'reuniao':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 3.25;
            break;

        case 'sistema_seguranca':
        case 'certificado_seguranca':
            var area = document.getElementById('area').value;
            var areaConstruida = document.getElementById('areaConstruida').value;
            
            if (!validateRequired(area, 'a área objeto do pedido')) return;
            if (!validateRequired(areaConstruida, 'a área total construída')) return;
            
            area = parseFloat(area);
            areaConstruida = parseFloat(areaConstruida);
            
            if (areaConstruida <= 20000) {
                valor = area * 3.11;
            } else {
                valor = area * 6.19;
            }
            break;

        case 'certificado_manutencao':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 1.90;
            break;

        case 'tanques_bombas':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a quantidade de equipamentos')) return;
            area = parseFloat(area);
            valor = area * 232.56;
            break;

        case 'desmembramento_remembramento':
        case 'diretrizes_urbanisticas':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 0.35;
            break;

        case 'reparcelamento':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 0.30;
            break;

        case 'execucao':
            valor = 1116.27;
            break;

        default:
            valor = 0;
    }

    resultado.textContent = 'Valor estimado: R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
