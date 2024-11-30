export function generarManchesterDiferencial(bits, voltajeInicial) {
    const manchesterDifData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    

    let ultimaTransicion = voltajeInicial >= 0;
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            ultimaTransicion = !ultimaTransicion;
        }
        if (ultimaTransicion) {
            manchesterDifData.push(voltajeBajo);
            manchesterDifData.push(voltajeAlto);
        } else { 
            manchesterDifData.push(voltajeAlto);
            manchesterDifData.push(voltajeBajo);
        }
    }

    return manchesterDifData;
} 