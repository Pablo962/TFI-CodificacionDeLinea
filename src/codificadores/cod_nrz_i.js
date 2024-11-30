export function generarNRZI(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let nivelActual = voltajeAlto;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            nivelActual = (nivelActual === voltajeAlto) ? voltajeBajo : voltajeAlto;
        }
        data.push(nivelActual);
        data.push(nivelActual);
    }
    
    return data;
} 