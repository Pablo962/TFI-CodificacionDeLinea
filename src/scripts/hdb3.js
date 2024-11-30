import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarHDB3 } from '../codificadores/cod_hdb3.js';

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

        const hdb3Data = generarHDB3(inputBits, voltajeInicial);
        
        const labels = new Array(hdb3Data.length).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i];  
        }

        if (chart) chart.destroy();

        const ctx = document.getElementById('hdb3Chart').getContext('2d');
        const config = createChartConfig(hdb3Data, labels, 'Señal HDB3', voltajeInicial);
        
        config.options.scales.x = {
            grid: {
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5], 
                lineWidth: 1,
                color: (context) => {
                    return context.index % 2 === 0 ? '#ddd' : 'transparent';
                },
            },
            ticks: {
                display: true,
                autoSkip: false,
                align: 'center'
            }
        };

        config.options.scales.y = {
            min: -voltajeInicial * 1.5,
            max: voltajeInicial * 1.5,
            grid: {
                display: true,
                drawOnChartArea: true,
                color: (context) => {
                    if (context.tick.value === 0) {
                        return '#666';
                    }
                    return 'transparent'; 
                },
                borderDash: [5, 5],
                lineWidth: 1
            },
            ticks: {
                display: true
            }
        };

        config.data.datasets[0].stepped = true;    
        config.data.datasets[0].steppedLine = 'before';  
        config.data.datasets[0].lineTension = 0;
        config.data.datasets[0].pointRadius = 0;
        
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