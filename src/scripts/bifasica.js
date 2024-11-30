import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarManchester } from '../codificadores/cod_manchester.js';
import { generarManchesterDiferencial } from '../codificadores/cod_manchester_diferencial.js';

document.addEventListener('DOMContentLoaded', function() {
    let manchesterChart = null;
    let differentialChart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        
        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;
        
        const containers = document.querySelectorAll('.chart-container, canvas');
        containers.forEach(container => {
            container.style.width = `${width}%`;
            if (container.tagName.toLowerCase() === 'div') {
                container.style.height = `${height}px`;
            }
        });

        requestAnimationFrame(() => {
            if (manchesterChart) manchesterChart.resize();
            if (differentialChart) differentialChart.resize();
        });
    }

    function actualizarLayoutGraficas() {
        const displayType = document.querySelector('input[name="displayType"]:checked').value;
        const manchesterContainer = document.getElementById('manchesterContainer');
        const differentialContainer = document.getElementById('differentialContainer');
        
        // Primero resetear las clases
        manchesterContainer.className = 'chart-container';
        differentialContainer.className = 'chart-container';
        
        switch(displayType) {
            case 'manchester':
                manchesterContainer.className = 'chart-container col-12';
                differentialContainer.style.display = 'none';
                manchesterContainer.style.display = 'block';
                break;
            case 'differential':
                differentialContainer.className = 'chart-container col-12';
                manchesterContainer.style.display = 'none';
                differentialContainer.style.display = 'block';
                break;
            case 'both':
                manchesterContainer.className = 'chart-container col-12 col-md-6';
                differentialContainer.className = 'chart-container col-12 col-md-6';
                manchesterContainer.style.display = 'block';
                differentialContainer.style.display = 'block';
                break;
        }

        // Forzar actualización de tamaño
        requestAnimationFrame(() => {
            if (manchesterChart) manchesterChart.resize();
            if (differentialChart) differentialChart.resize();
        });
    }

    function configurarGrafica(config, labels) {
        config.options.scales.x.ticks.callback = function(value, index) {
            return labels[index] || '';
        };
        
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min - 1;
        };
        
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1;
        };
    }

    function crearLabels(bits) {
        const bitsConExtra = bits + '0';
        const labels = new Array(bitsConExtra.length * 2).fill('');
        
        for (let i = 0; i < bitsConExtra.length; i++) {
            labels[i * 2] = bitsConExtra[i];
        }
        
        return labels;
    }

    function actualizarGraficos() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);
        const displayType = document.querySelector('input[name="displayType"]:checked').value;

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

        const labels = new Array((inputBits.length * 2) + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i];
        }
        
        if (manchesterChart) manchesterChart.destroy();
        if (differentialChart) differentialChart.destroy();

        if (displayType === 'manchester' || displayType === 'both') {
            let manchesterData = generarManchester(inputBits, voltajeInicial);
            const ctx1 = document.getElementById('manchesterChart').getContext('2d');
            const config1 = createChartConfig(manchesterData, labels, 'Señal Manchester', voltajeInicial);
            configurarGrafica(config1, labels);
            manchesterChart = new Chart(ctx1, config1);
        }

        if (displayType === 'differential' || displayType === 'both') {
            let manchesterDifData = generarManchesterDiferencial(inputBits, voltajeInicial);
            const ctx2 = document.getElementById('manchesterDifferentialChart').getContext('2d');
            const config2 = createChartConfig(manchesterDifData, labels, 'Señal Manchester Diferencial', voltajeInicial);
            configurarGrafica(config2, labels);
            differentialChart = new Chart(ctx2, config2);
        }

        actualizarLayoutGraficas();
    }

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('inputBits').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            actualizarGraficos();
        }
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGraficos);
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    document.querySelectorAll('input[name="displayType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            
            const inputBits = document.getElementById('inputBits').value.trim();
            if (inputBits) {
                actualizarGraficos();
            } else {
                actualizarLayoutGraficas();
            }
        });
    });

    // Establecer valor por defecto del ancho a 100%
    const sliderAncho = document.getElementById('chartWidth');
    sliderAncho.value = 100;
    sliderAncho.setAttribute('value', '100');

    document.getElementById('inputBits').addEventListener('input', function() {
        this.value = this.value.replace(/[^01]/g, ''); 
    });

    document.getElementById('voltajeInicial').addEventListener('input', function() {
        const value = this.value;
        if (value !== '-' && !/^-?\d*\.?\d*$/.test(value)) {
            this.value = value.slice(0, -1);
        }
    });

    actualizarTamanoGraficos();
});