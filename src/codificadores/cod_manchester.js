export function generarManchester(bits, voltajeInicial) {
    const manchesterData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            manchesterData.push(voltajeAlto);
            manchesterData.push(voltajeBajo);
        } else {
            manchesterData.push(voltajeBajo);
            manchesterData.push(voltajeAlto);
        }
    }
    manchesterData.push(manchesterData[manchesterData.length - 1]);

    return manchesterData;
}
