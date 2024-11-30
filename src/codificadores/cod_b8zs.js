export function generarB8ZS(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let ultimaPolaridad = voltajeInicial > 0 ? voltajeAlto : voltajeBajo;


    if (bits[0] === '1') {
        data.push(ultimaPolaridad); 
        data.push(ultimaPolaridad);
    }

    let contadorCeros = 0;
    
    for (let i = 1; i < bits.length; i++) {
        const bit = bits[i];
        
        if (bit === '0') {
            contadorCeros++;
            
            if (contadorCeros === 4) {
                // Si el voltaje inicial fue negativo, la secuencia es diferente
                if (voltajeInicial < 0) {
                    data.push(voltajeBajo); // B
                    data.push(voltajeBajo);
                } else {
                    data.push(voltajeAlto); // V
                    data.push(voltajeAlto);
                }
            } else if (contadorCeros === 5) {
                if (voltajeInicial < 0) {
                    data.push(voltajeAlto); // V
                    data.push(voltajeAlto);
                } else {
                    data.push(voltajeBajo); // B
                    data.push(voltajeBajo);
                }
            } else if (contadorCeros === 6) {
                data.push(0);
                data.push(0);
            } else if (contadorCeros === 7) {
                if (voltajeInicial < 0) {
                    data.push(voltajeAlto); // V
                    data.push(voltajeAlto);
                } else {
                    data.push(voltajeBajo); // B
                    data.push(voltajeBajo);
                }
            } else if (contadorCeros === 8) {
                if (voltajeInicial < 0) {
                    data.push(voltajeBajo); // B
                    data.push(voltajeBajo);
                } else {
                    data.push(voltajeAlto); // V
                    data.push(voltajeAlto);
                }
                contadorCeros = 0;
            } else {
                data.push(0);
                data.push(0);
            }
        } else {
            contadorCeros = 0;
            ultimaPolaridad = (ultimaPolaridad === voltajeAlto) ? voltajeBajo : voltajeAlto;
            data.push(ultimaPolaridad);
            data.push(ultimaPolaridad);
        }
    }

    return data;
}

export function generarPuntosGraficos(data) {
    const puntos = [];
    let tiempo = 0;

    for (let i = 0; i < data.length; i++) {
        puntos.push([tiempo, data[i]]);
        tiempo += 0.5;
    }

    return puntos;
}

