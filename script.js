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
    document.getElementById('areaConstruirAprovado').value = '';
    document.getElementById('areaReformarAprovado').value = '';
    document.getElementById('areaTotalAprovado').value = '';
    document.getElementById('areaConstruirModificativo').value = '';
    document.getElementById('areaReformarModificativo').value = '';
    document.getElementById('areaTotalModificativo').value = '';
    document.getElementById('resultado').textContent = '';
    
    var assunto = document.getElementById('assunto').value;
    var areaLabel = document.getElementById('areaLabel');
    var areaStandardContainer = document.getElementById('areaStandardContainer');
    var areaConstruidaContainer = document.getElementById('areaConstruidaContainer');
    var projetoModificativoContainer = document.getElementById('projetoModificativoReformaContainer');

    // Ocultar todos os containers primeiro
    areaStandardContainer.style.display = 'none';
    areaConstruidaContainer.style.display = 'none';
    projetoModificativoContainer.style.display = 'none';

    switch (assunto) {
        case 'reforma':
            areaStandardContainer.style.display = 'block';
            areaConstruidaContainer.style.display = 'block';
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

    switch (assunto) {
        case 'edificacao_nova':
            var area = parseFloat(document.getElementById('area').value);
            if (area <= 1500) {
                valor = area * 6.69;
            } else if (area <= 20000) {
                valor = area * 8.93;
            } else {
                valor = area * 11.90;
            }
            break;

        case 'reforma':
            var area = parseFloat(document.getElementById('area').value);
            var areaConstruida = parseFloat(document.getElementById('areaConstruida').value);
            if (areaConstruida <= 1500) {
                valor = area * 6.69;
            } else if (areaConstruida <= 20000) {
                valor = area * 8.93;
            } else {
                valor = area * 11.90;
            }
            break;

        case 'projeto_modificativo_edificacao':
            var area = parseFloat(document.getElementById('area').value);
            var areaConstruida = parseFloat(document.getElementById('areaConstruida').value);
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
            var areaConstruirAprovado = parseFloat(document.getElementById('areaConstruirAprovado').value);
            var areaReformarAprovado = parseFloat(document.getElementById('areaReformarAprovado').value);
            var areaTotalAprovado = parseFloat(document.getElementById('areaTotalAprovado').value);
            var areaConstruirModificativo = parseFloat(document.getElementById('areaConstruirModificativo').value);
            var areaReformarModificativo = parseFloat(document.getElementById('areaReformarModificativo').value);
            var areaTotalModificativo = parseFloat(document.getElementById('areaTotalModificativo').value);
            
            // Calcular diferenças nas áreas a construir e reformar
            var diferencaConstruir = Math.max(0, areaConstruirModificativo - areaConstruirAprovado);
            var diferencaReformar = Math.max(0, areaReformarModificativo - areaReformarAprovado);
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
            } else if (areaTotalModificativo <= 20000){
                areaModificada = areaModificada * 2.98;
                diferencaConstruir = diferencaConstruir * 8.93;
                diferencaReformar = diferencaReformar * 8.93;
            } else {
                areaModificada = areaModificada * 4.47;
                diferencaConstruir = diferencaConstruir * 11.90;
                diferencaReformar = diferencaReformar * 11.90;
            }

            valor = (areaModificada + diferencaConstruir + diferencaReformar);
            break;

        case 'avanco_grua':
        case 'tapume':
            var area = parseFloat(document.getElementById('area').value);
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
            var area = parseFloat(document.getElementById('area').value);
            valor = area * 2.98;
            break;

        case 'acessibilidade':
            var area = parseFloat(document.getElementById('area').value);
            var areaConstruida = parseFloat(document.getElementById('areaConstruida').value);
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
            var area = parseFloat(document.getElementById('area').value);
            valor = area * 3.10;
            break;

        case 'sistema_seguranca':
        case 'certificado_seguranca':
            var area = parseFloat(document.getElementById('area').value);
            var areaConstruida = parseFloat(document.getElementById('areaConstruida').value);
            if (areaConstruida <= 20000) {
                valor = area * 2.98;
            } else {
                valor = area * 5.94;
            }
            break;

        case 'certificado_manutencao':
            var area = parseFloat(document.getElementById('area').value);
            valor = area * 1.85;
            break;

        case 'tanques_bombas':
            var area = parseFloat(document.getElementById('area').value);
            valor = area * 223.06;
            break;

        case 'desmembramento_remembramento':
        case 'diretrizes_urbanisticas':
            var area = parseFloat(document.getElementById('area').value);
            valor = area * 0.34;
            break;

        case 'reparcelamento':
            var area = parseFloat(document.getElementById('area').value);
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