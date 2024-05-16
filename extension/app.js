const { stdin, stdout } = process;

let inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function(chunk) {
    let message = chunk.toString();  // 使用 chunk 而不是 data
    console.log("Received message:", message);
    inputChunks.push(chunk);
});

stdin.on('end', function() {
    let inputJSON = inputChunks.join();
    let receivedMessage = JSON.parse(inputJSON);
    if (receivedMessage.text === "start_server") {
        // 在這裡加入啟動您的 Express.js 服務器的代碼
        console.log("Starting server...");
        // 模擬服務器啟動成功
        let responseMessage = { text: "Server started" };
        let responseJSON = JSON.stringify(responseMessage);
        stdout.write(responseJSON);
        stdout.write('\n');
        process.exit();
    }
});

// 模擬返回消息
process.stdout.write(JSON.stringify({response: "Message received"}));
