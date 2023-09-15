const signPayload = (data, pkWIF, address, isLike = false) => {
    const arrops = data.getOps('utf8');
    let hexarrops = [];
    hexarrops.push('6a');
    if (isLike) { hexarrops.push('6a') }
    arrops.forEach(o => { hexarrops.push(str2Hex(o)) })
    if (isLike) { hexarrops.push('7c') }
    let hexarr = [], payload = [];
    if (pkWIF) {
        const b2sign = hexArrayToBSVBuf(hexarrops);
        const bsvPrivateKey = bsv.PrivateKey.fromWIF(pkWIF);
        const signature = bsvMessage.sign(b2sign.toString(), bsvPrivateKey);
        payload = arrops.concat(['|', AIP_PROTOCOL_ADDRESS, 'BITCOIN_ECDSA', address, signature]);
    } else { payload = arrops }
    payload.forEach(p => { hexarr.push(str2Hex(p)) })
    return { hexarr, payload };
}
const str2Hex = str => {
    hex = unescape(encodeURIComponent(str)).split('').map(v => {return v.charCodeAt(0).toString(16).padStart(2,'0')}).join('');
    return hex;
}
const hex2Str = hex => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        let v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str; 
}
const hexArrayToBSVBuf = arr => {
    const hexBuf = arrToBuf(arr);
    const decoded = new TextDecoder().decode(hexBuf);
    const str2sign = hex2Str(decoded);
    const abuf = strToArrayBuffer(str2sign);
    const bsvBuf = dataToBuf(abuf);
    return bsvBuf;
}
const arrToBuf = arr => {
    const msgUint8 = new TextEncoder().encode(arr);
    const decoded = new TextDecoder().decode(msgUint8);
    const value = decoded.replaceAll(',', '');
    return new TextEncoder().encode(value);
}
const strToArrayBuffer = binary_string => {
    const bytes = new Uint8Array( binary_string.length );
    for (let i = 0; i < binary_string.length; i++)  {bytes[i] = binary_string.charCodeAt(i) }
    return bytes;
}
const dataToBuf = arr => {
    const bufferWriter = bsv.encoding.BufferWriter();
    arr.forEach(a => { bufferWriter.writeUInt8(a) });
    return bufferWriter.toBuffer();
}