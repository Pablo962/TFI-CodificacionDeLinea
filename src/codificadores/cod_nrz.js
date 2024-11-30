export function generarNRZ(bits, voltajeAlto, voltajeBajo, voltajeInicial) {
    const nrzData = [];
    let voltajeActual = voltajeInicial;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            voltajeActual = voltajeInicial >= 0 ? voltajeAlto : voltajeBajo;
        } else {
            voltajeActual = voltajeInicial >= 0 ? voltajeBajo : voltajeAlto;
        }
        nrzData.push(voltajeActual);
        nrzData.push(voltajeActual);
    }

    return nrzData;
} 