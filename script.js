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
    document.getElementById('areaRegularizar').value = '';
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
    var areaRegularizarContainer = document.getElementById('areaRegularizarContainer');
    var projetoModificativoContainer = document.getElementById('projetoModificativoReformaContainer');

    // Ocultar todos os containers primeiro
    areaStandardContainer.style.display = 'none';
    areaConstruidaContainer.style.display = 'none';
    areaRegularizarContainer.style.display = 'none';
    projetoModificativoContainer.style.display = 'none';

    switch (assunto) {
        case 'reforma':
            areaStandardContainer.style.display = 'block';
            areaConstruidaContainer.style.display = 'block';
            areaRegularizarContainer.style.display = 'block';
            areaLabel.textContent = 'Informe a área a ser reformada em m²:';
            break;

        case 'projeto_modificativo_edificacao':
            areaStandardContainer.style.display = 'block';
            areaConstruidaContainer.style.display = 'block';
            areaLabel.textContent = 'Informe a área total na planta do Projeto Modificativo em m²:';
            document.querySelector('#areaConstruidaContainer label').textContent = 'Área total construída no alvará:';
            break;
            
        case 'projeto_modificativo_reforma':
            projetoModificativoContainer.style.display = 'block';
            break;

        case 'edificacao_nova':
            areaStandardContainer.style.display = 'block';
            areaLabel.textContent = 'Informe a área a ser construída em m²:';
            break;

        case 'tapume':
        case 'avanco_grua':
            areaStandardContainer.style.display = 'block';
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
            areaLabel.textContent = 'Informe a área objeto do pedido em m²:';
            document.querySelector('#areaConstruidaContainer label').textContent = 'Informe a área total construída em m²:';
            break;

        default:
            areaStandardContainer.style.display = 'block';
            areaLabel.textContent = 'Informe a área objeto do pedido em m²:';
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

    // Função auxiliar para campos opcionais (área a regularizar)
    function parseOptional(value) {
        return value === '' ? 0 : parseFloat(value);
    }

    switch (assunto) {
        case 'edificacao_nova':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área a ser construída')) return;
            area = parseFloat(area);
            
            if (area <= 1500) {
                valor = area * 6.69;
            } else if (area <= 20000) {
                valor = area * 8.93;
            } else {
                valor = area * 11.90;
            }
            break;

        case 'reforma':
            var area = document.getElementById('area').value;
            var areaConstruida = document.getElementById('areaConstruida').value;
            
            if (!validateRequired(area, 'a área a ser reformada')) return;
            if (!validateRequired(areaConstruida, 'a área total construída')) return;
            
            area = parseFloat(area);
            areaConstruida = parseFloat(areaConstruida);
            var areaRegularizar = parseOptional(document.getElementById('areaRegularizar').value);
            
            // Cálculo base para reforma
            if (areaConstruida <= 1500) {
                valor = (area * 6.69) + (areaRegularizar * 5.94);
            } else if (areaConstruida <= 20000) {
                valor = (area * 8.93) + (areaRegularizar * 8.93);
            } else {
                valor = (area * 11.90) + (areaRegularizar * 11.90);
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
                valor = area * 3.73;
              } else {
                valor = (area - areaConstruida) * 6.69 + (areaConstruida * 3.73);
              }
            } else if (area <= 20000) {
                if (area <= areaConstruida) {
                valor = area * 4.47;
              } else {
                valor = (area - areaConstruida) * 8.93 + (areaConstruida * 4.47);
              }
            } else {
                if (area <= areaConstruida) {
                valor = area * 5.94;
              } else {
                valor = (area - areaConstruida) * 11.90 + (areaConstruida * 5.94);
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
                areaModificada = areaModificada * 1.49;
                diferencaConstruir = diferencaConstruir * 6.69;
                diferencaReformar = diferencaReformar * 6.69;
                diferencaRegularizar = diferencaRegularizar * 5.94;
            } else if (areaTotalModificativo <= 20000){
                areaModificada = areaModificada * 2.98;
                diferencaConstruir = diferencaConstruir * 8.93;
                diferencaReformar = diferencaReformar * 8.93;
                diferencaRegularizar = diferencaRegularizar * 8.93;
            } else {
                areaModificada = areaModificada * 4.47;
                diferencaConstruir = diferencaConstruir * 11.90;
                diferencaReformar = diferencaReformar * 11.90;
                diferencaRegularizar = diferencaRegularizar * 11.90;
            }

            valor = (areaModificada + diferencaConstruir + diferencaReformar + diferencaRegularizar);
            break;

        case 'avanco_grua':
        case 'tapume':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área construída')) return;
            area = parseFloat(area);
            
            if (area <= 1500) {
                valor = 1040.89;
            } else if (area > 1500) {
                valor = 2081.82;
            } else {
                valor = 0;
            }
            break;

        case 'alvara_heliponto':
            valor = 2160.00;
            break;

        case 'execucao_erb':
            valor = 239.00;
            break;

        case 'estande_vendas':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 2.98;
            break;

        case 'acessibilidade':
            var area = document.getElementById('area').value;
            var areaConstruida = document.getElementById('areaConstruida').value;
            
            if (!validateRequired(area, 'a área objeto do pedido')) return;
            if (!validateRequired(areaConstruida, 'a área total construída')) return;
            
            area = parseFloat(area);
            areaConstruida = parseFloat(areaConstruida);
            
            if (areaConstruida <= 1500) {
                valor = area * 2.98;
            } else if (areaConstruida <= 20000) {
                valor = area * 4.47;
            } else if (areaConstruida > 20000) {
                valor = area * 5.94;
            } else {
                valor = 0;
            }
            break;

        case 'reuniao':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 3.10;
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
                valor = area * 2.98;
            } else {
                valor = area * 5.94;
            }
            break;

        case 'certificado_manutencao':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 1.85;
            break;

        case 'tanques_bombas':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a quantidade de equipamentos')) return;
            area = parseFloat(area);
            valor = area * 223.06;
            break;

        case 'desmembramento_remembramento':
        case 'diretrizes_urbanisticas':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 0.34;
            break;

        case 'reparcelamento':
            var area = document.getElementById('area').value;
            if (!validateRequired(area, 'a área')) return;
            area = parseFloat(area);
            valor = area * 0.30;
            break;

        case 'execucao':
            valor = 1070.66;
            break;

        default:
            valor = 0;
    }

    resultado.textContent = 'Valor estimado do Preço Público: R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
