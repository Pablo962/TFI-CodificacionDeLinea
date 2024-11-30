export function generarNRZL(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);

    for (let i = 0; i < bits.length; i++) {
        const nivel = bits[i] === '0' ? voltajeAlto : voltajeBajo;
        data.push(nivel); 
        data.push(nivel); 
    }
    
    return data;
} 