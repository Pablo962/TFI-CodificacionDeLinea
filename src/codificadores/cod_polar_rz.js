export function generarPolarRZ(bits, voltajeInicial) {
    const data = [];
    const voltajePositivo = voltajeInicial;
    const voltajeNegativo = -voltajeInicial;
    const voltajeCero = 0;

    for (let i = 0; i < bits.length; i++) {
        const bitActual = bits[i];

        if (bitActual === '1') {
            data.push(voltajePositivo);
            data.push(voltajeCero);
        } else if (bitActual === '0') {
            data.push(voltajeNegativo);
            data.push(voltajeCero);
        }
    }
    data.push(voltajeCero);
    return data;
}
