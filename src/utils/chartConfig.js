export const createChartConfig = (data, labels, title, voltajeInicial) => {
    // Calcular los límites base
    const limites = calcularLimites(data);
    const maxAbs = Math.max(Math.abs(limites.min), Math.abs(limites.max));
    const margenExtra = 2;
    const maxTotal = maxAbs + margenExtra;

    // Crear anotaciones para las líneas verticales
    const annotations = {};
    const numBits = (labels.length - 1) / 2; // Calculamos el número de bits basado en las etiquetas
    
    // Agregar líneas verticales punteadas
    for (let i = 0; i <= numBits; i++) {
        annotations[`line${i}`] = {
            type: 'line',
            xMin: i * 2,
            xMax: i * 2,
            yMin: -voltajeInicial * 1.5,
            yMax: voltajeInicial * 1.5,
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            drawTime: 'beforeDatasetsDraw'
        };
    }

    // Agregar línea horizontal en y=0
    annotations.zeroline = {
        type: 'line',
        yMin: 0,
        yMax: 0,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        drawTime: 'beforeDatasetsDraw'
    };

    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                borderColor: '#00ffff',
                backgroundColor: '#00ffff',
                borderWidth: 4,
                pointRadius: 0,
                pointBackgroundColor: '#00ffff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: false,
                stepped: true,
                tension: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    ticks: {
                        
                        callback: function(value) {
                            return labels[value] || '';
                        },
                        
                        maxRotation: 0,
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: annotations
                },
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    };
};

export const calcularLimites = (data) => {
    const valores = data.filter(val => val !== null);
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const rango = max - min;
    return {
        max: max + rango * 0.1,
        min: min - rango * 0.1
    };
}; 