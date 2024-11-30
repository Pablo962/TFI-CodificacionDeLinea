import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZ } from '../codificadores/cod_nrz.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        const container = document.getElementById('timeChartContainer');

        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;

        container.style.width = `${width}%`;
        container.style.height = `${height}px`;
        
        if (chart) {
            chart.resize();
        }
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

        if (isNaN(voltajeInicial) || voltajeInicial <= 0) {
            alert('El voltaje inicial debe ser un valor numérico positivo');
            return;
        }

        const voltajeAlto = voltajeInicial;
        const voltajeBajo = 0;
        
        const nrzData = generarNRZ(inputBits, voltajeAlto, voltajeBajo, voltajeInicial);
        
        const labels = new Array((inputBits.length * 2) + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i];  
        }

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzChart').getContext('2d');
        const config = createChartConfig(nrzData, labels, 'Señal NRZ', voltajeInicial);
        
        config.options.scales.x.min = 0; 
        config.options.scales.x.max = inputBits.length * 2; 
        config.options.scales.x.ticks.callback = function(value, index) {
            return labels[index] || '';
        };
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min; 
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1; 
        };

        chart = new Chart(ctx, config);
    }

    document.getElementById('inputBits').addEventListener('input', function() {
        this.value = this.value.replace(/[^01]/g, '');
    });

    document.getElementById('voltajeInicial').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9.]/g, '');
        if (this.value.startsWith('.')) {
            this.value = '0' + this.value;
        }
    });

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
    
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);

    document.getElementById('chartWidth').value = 100;
    
    actualizarTamanoGraficos();
});