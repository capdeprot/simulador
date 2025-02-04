document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            calculate();
            event.preventDefault();
        }
    });
});

function changeLabel() {
    document.getElementById('area').value = '';
    document.getElementById('areaConstruida').value = '';
    document.getElementById('resultado').textContent = '';
    
    var assunto = document.getElementById('assunto').value;
    var areaLabel = document.getElementById('areaLabel');
    var areaConstruidaContainer = document.getElementById('areaConstruidaContainer');

    switch (assunto) {
        case 'reforma':
            areaLabel.textContent = 'Informe a área a ser reformada em m²:';
            areaConstruidaContainer.style.display = 'block';
            break;

        case 'projeto_modificativo_edificacao':
            areaLabel.textContent = 'Informe a área total na planta do Projeto Modificativo em m²:';
            areaConstruidaContainer.style.display = 'block';
            document.getElementById('areaConstruidaContainer').innerHTML = `
                <label for="areaConstruida">Área total construída no alvará:</label>
                <input type="number" id="areaConstruida" step="1" min="0" required>
            `;
            break;

        case 'edificacao_nova':
            areaLabel.textContent = 'Informe a área a ser construída em m²:';
            areaConstruidaContainer.style.display = 'none';
            break;

        case 'tapume':
        case 'avanco_grua':
            areaLabel.textContent = 'Informe a área construída em m²:';
            areaConstruidaContainer.style.display = 'none';
            break;

        case 'tanques_bombas':
            areaLabel.textContent = 'Informe a quantidade de equipamentos:';
            areaConstruidaContainer.style.display = 'none';
            break;

        case 'acessibilidade':
        case 'sistema_seguranca':
        case 'certificado_seguranca':
            areaLabel.textContent = 'Informe a área objeto do pedido em m²:';
            areaConstruidaContainer.style.display = 'block';
            break;

        default:
            areaLabel.textContent = 'Informe a área objeto do pedido em m²:';
            areaConstruidaContainer.style.display = 'none';
            break;
    }
}

function calculate() {
    var assunto = document.getElementById('assunto').value;

    if (!assunto) {
        alert("Por favor, selecione uma opção válida.");
        return;
    }

    var area = parseFloat(document.getElementById('area').value);
    var areaConstruida = 0;

    if (assunto === 'reforma' || assunto === 'projeto_modificativo_edificacao' || assunto === 'acessibilidade' || assunto === 'sistema_seguranca' || assunto === 'certificado_seguranca') {
        areaConstruida = parseFloat(document.getElementById('areaConstruida').value);
    }

    var resultado = document.getElementById('resultado');
    var valor;

    switch (assunto) {
        case 'edificacao_nova':
            if (area <= 1500) {
                valor = area * 6.69;
            } else if (area <= 20000) {
                valor = area * 8.93;
            } else {
                valor = area * 11.90;
            }
            break;

        case 'reforma':
            if (areaConstruida <= 1500) {
                valor = area * 6.69;
            } else if (areaConstruida <= 20000) {
                valor = area * 8.93;
            } else {
                valor = area * 11.90;
            }
            break;

        case 'projeto_modificativo_edificacao':
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

        case 'avanco_grua':
        case 'tapume':
            if (area <= 1500) {
                valor = 1040.89;
            } else if (area > 1500) {
                valor = 2081.82;
            } else {
                valor = 0
            }
            break;

        case 'alvara_heliponto':
            valor = 2160.00
            break;

        case 'execucao_erb':
            valor = 239.00
            break;

        case 'estande_vendas':
            valor = area * 2.98;
            break;

        case 'acessibilidade':
            if (areaConstruida <= 1500) {
                valor = area * 2.98;
            } else if (areaConstruida <= 20000) {
                valor = area * 4.47;
            } else if (areaConstruida > 20000) {
                valor = area * 5.94;
            } else {
                valor = 0
            }
            break;

        case 'reuniao':
            valor = area * 3.10;
            break;

        case 'sistema_seguranca':
        case 'certificado_seguranca':
            if (areaConstruida <= 20000) {
                valor = area * 2.98;
            } else {
                valor = area * 5.94;
            }
            break;

        case 'tanques_bombas':
            valor = area * 223.06;
            break;

        case 'desmembramento_remembramento':
        case 'diretrizes_urbanisticas':
            valor = area * 0.34;
            break;

        case 'reparcelamento':
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