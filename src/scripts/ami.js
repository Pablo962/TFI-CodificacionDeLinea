import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarAMI } from '../codificadores/cod_ami.js';

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

        const bitsConExtra = inputBits + '0';
        const amiData = generarAMI(bitsConExtra, voltajeInicial);
        
        const labels = new Array((inputBits.length * 2) + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i]; 
        }

        if (chart) chart.destroy();

        const ctx = document.getElementById('amiChart').getContext('2d');
        const config = createChartConfig(amiData, labels, 'Señal AMI', voltajeInicial);
        
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min;
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max;
        };

        config.options.scales.x.ticks.callback = function(value, index) {
            return labels[index] || '';
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