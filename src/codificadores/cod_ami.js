export function generarAMI(bits, voltajeInicial) {
    const amiData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let ultimaPolaridad = voltajeInicial >= 0 ? voltajeAlto : voltajeBajo;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            amiData.push(ultimaPolaridad);
            amiData.push(ultimaPolaridad)
            ultimaPolaridad = (ultimaPolaridad === voltajeAlto) ? voltajeBajo : voltajeAlto;
        } else {
            amiData.push(0);
            amiData.push(0);

        }
    }

    return amiData;
} 