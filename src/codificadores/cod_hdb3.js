export function generarHDB3(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    
    let ultimaPolaridad = voltajeInicial >= 0 ? voltajeBajo : voltajeAlto;
    let contadorCeros = 0;
    let contadorPulsos = 0;
    let ultimoPatronFueB00V = false;
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            ultimaPolaridad = -ultimaPolaridad;
            agregarPulso(data, ultimaPolaridad);
            contadorPulsos++;
            contadorCeros = 0;
        } else {
            contadorCeros++;
            
            if (contadorCeros === 4) {
                
                data.splice(data.length - 6, 6);
                
                if (contadorPulsos % 2 ===0) {
                    let polaridadBV;
                        
                        if (ultimaPolaridad > 0) {
                            polaridadBV = voltajeBajo; // B y V negativos
                        } else {
                            polaridadBV = voltajeAlto;// B y V positivos
                        }
                    agregarPulso(data, polaridadBV);     // B
                    agregarPulso(data, 0);               // 0
                    agregarPulso(data, 0);               // 0
                    agregarPulso(data, polaridadBV);     // V
                    ultimaPolaridad = polaridadBV;
                    ultimoPatronFueB00V = true;
                    contadorPulsos=0;
                } else {
                    
                    let polaridadV;
                    
                        if (ultimaPolaridad > 0) {
                            polaridadV = voltajeAlto;
                            contadorPulsos=0;  // V positivo
                        } else {
                            polaridadV = voltajeBajo;
                            contadorPulsos=0;  // V negativo
                        }
                    agregarPulso(data, 0);              // 0
                    agregarPulso(data, 0);              // 0
                    agregarPulso(data, 0);              // 0
                    agregarPulso(data, polaridadV);     // V
                    ultimaPolaridad = polaridadV;
                    ultimoPatronFueB00V = false;
                    contadorPulsos=0;
                }
                
                contadorCeros = 0;
            } else {
                agregarPulso(data, 0);
            }
        }
    }
    
    return data;
}

function agregarPulso(data, valor) {
    data.push(valor);
    data.push(valor);
}

export function generarPuntosGraficos(data) {
    const puntos = [];
    let tiempo = 0;
    const intervalo = 0.5;

    for (let i = 0; i < data.length; i++) {
        puntos.push([tiempo, data[i]]);
        tiempo += intervalo;
    }

    return puntos;
}