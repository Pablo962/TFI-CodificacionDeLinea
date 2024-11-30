import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarB8ZS } from '../codificadores/cod_b8zs.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        
        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;
      
        const timeContainer = document.getElementById('timeChartContainer');
        timeContainer.style.width = `${width}%`;
        timeContainer.style.height = `${height}px`;

        if (chart) chart.resize();
    }

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);

        if (!inputBits) {
            alert('Por favor, ingrese una secuencia de bits');
            return;
        }
        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        if (isNaN(voltajeInicial)) {
            alert('Por favor, ingrese un valor numérico para el voltaje.');
            return;
        }

        const b8zsData = generarB8ZS(inputBits, voltajeInicial);
        
        const labels = new Array(inputBits.length * 2 + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i];  
        }

        if (chart) chart.destroy();

        const ctx = document.getElementById('b8zsChart').getContext('2d');
        const config = createChartConfig(b8zsData, labels, 'Señal B8ZS');
        
        
        config.options.scales.x.ticks.callback = function(value, index) {
            return labels[index] || '';
        };
      
        config.options.scales.x.grid.display = true;
        config.options.scales.x.grid.color = 'rgba(255, 255, 255, 0.2)';
        config.options.scales.x.grid.borderDash = [5, 5];
        
      
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min - 1;
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1;
        };

        chart = new Chart(ctx, config);
    }

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico); 
  
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartWidth').value = 100;
 
    actualizarTamanoGraficos();

    document.getElementById('inputBits').addEventListener('input', function() {
        this.value = this.value.replace(/[^01]/g, ''); 
    });

    document.getElementById('voltajeInicial').addEventListener('input', function() {
        const value = this.value;
        if (value !== '-' && !/^-?\d*\.?\d*$/.test(value)) {
            this.value = value.slice(0, -1);
        }
    });
});