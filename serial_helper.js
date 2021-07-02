/* Web Serial below */

let port;
let reader;
let inputStream;
let inputDone;
let outputStream;
let outputDone;

async function connect() {
  port = await navigator.serial.requestPort();
  await port.open({
    baudRate: baudRate
  });

  let decoder = new TextDecoderStream();
  inputDone = port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;

  reader = inputStream.getReader();
  readLoop();

  const encoder = new TextEncoderStream();
  outputDone = encoder.readable.pipeTo(port.writable);
  outputStream = encoder.writable;
}

async function readLoop() {
  while (true) {
    const {
      value,
      done
    } = await reader.read();
    if (value) {
      console.log("[RECV] "+value)
      const event = new CustomEvent('serialdata', { detail: value });
      navigator.serial.dispatchEvent(event)
    }
    if (done) {
      console.log('[readLoop] DONE', done);
      reader.releaseLock();
      break;
    }
  }
}

function writeToStream(...lines) {
  const writer = outputStream.getWriter();
  lines.forEach((line) => {
    console.log('[SEND]', line);
    writer.write(line + '\n');
  });
  writer.releaseLock();
}