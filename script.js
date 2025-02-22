var conversationHistory = [];

var apiKey = prompt("Please enter your API key:", "");
var userName = prompt("Please enter your name:", "");

if (!apiKey || !userName) {
    alert("API key and name are required to use the chatroom.");
    // Optionally, redirect or disable form
} else {
    document.getElementById('messageForm').addEventListener('submit', function (event) {
        event.preventDefault();
        var inputElement = document.getElementById('messageInput');
        var message = inputElement.value;

        addToConversationHistory('user', message);
        displayMessage(message, 'user');
        inputElement.disabled = true;
        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "contents": conversationHistory,
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_NONE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_NONE"
                    },
                ],
                "generationConfig": {
                    "stopSequences": [
                        ""
                    ],
                    "temperature": 2.0,
                    "maxOutputTokens": 2048,
                    "topP": 0.8,
                    "topK": 10
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                var responseText = data.candidates[0].content.parts[0].text;
                addToConversationHistory('model', responseText);
                displayMessage(responseText, 'bot');
                inputElement.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error)
                inputElement.disabled = false;
            });

        document.getElementById('messageInput').value = '';
    });
}

function addToConversationHistory(role, text) {
    conversationHistory.push({
        "role": role,
        "parts": [{
            "text": text
        }]
    });
}

function displayMessage(message, sender) {
    var messageElement = document.createElement('div');
    var formatMessage = formatText(message);
    messageElement.classList.add('message');
    if (sender === 'user') {
        messageElement.classList.add('userMessage');
    } else {
        messageElement.classList.add('botMessage');
    }
    document.getElementById('messages').appendChild(messageElement);
    updateSceneImage(message);
    // Function to display the text one character at a time
    function typeText(element, text, index) {
        if (index < text.length) {
            let char = text[index];
            if (char === '<') {
                let endIndex = text.indexOf('>', index);
                if (endIndex !== -1) {
                    element.innerHTML += text.substring(index, endIndex + 1);
                    index = endIndex + 1;
                }
            } else {
                element.innerHTML += char;
                index++;
            }
            setTimeout(function () {
                typeText(element, text, index);
            }, 75); // Adjust typing speed by changing the delay (in milliseconds)
        } else {
            // Scroll to bottom after the entire message is displayed
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        }
    }

    // Start typing the formatted message
    typeText(messageElement, formatMessage, 0);
}

function updateSceneImage(responseText) {
    let sceneMatch = responseText.match(/場景：(.*?)\s/); // 使用正則表達式匹配場景描述
    if (sceneMatch && sceneMatch[1]) {
        let scene = sceneMatch[1];
        console.log(scene);
        if (scene.includes("教室)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/classroom.jpeg')";
        } else if (scene.includes("回家路上)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/Chaewon.jpeg')";
        } else if (scene.includes("采源家)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/chaeroom.jpeg')";
        } else if (scene.includes("學生會)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/Eunbi.jpeg')";
        } else if (scene.includes("圖書館)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/Dahyun.jpeg')";
        } else if (scene.includes("便利商店)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/711.jpeg')";
        } else if (scene.includes("公園)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/park.jpeg')";
        } else if (scene.includes("電影院)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/movie.jpeg')";
        } else if (scene.includes("飲料店)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/coffee.jpeg')";
        } else if (scene.includes("咖啡廳)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/coffee.jpeg')";
        } else if (scene.includes("校園)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/coffee.jpeg')";
        } else if (scene.includes("戶外)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/coffee.jpeg')";
        } else if (scene.includes("浪漫餐廳)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/rest1.jpeg')";
        } else if (scene.includes("休閒餐廳)")) {
            document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/rest2.jpeg')";
        }
    }
}

function formatText(text) {
    // Replace ** with a new line and bold tag
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong>');

    // Replace * with a new line and bullet point
    formattedText = formattedText.replace(/\*(.*?)\s/g, '<br>$1');

    return formattedText;
}

document.getElementById('introButton').addEventListener('click', function () {
    document.getElementById('introBlock').style.display = 'block';
    document.getElementById('gameIntro').style.display = 'none'; // Hide the intro button
    document.getElementById('startButton').style.display = 'block'; // Show the start button
});

document.getElementById('startButton').addEventListener('click', function () {
    // Change background image and display settings when starting the game
    document.getElementById('backgroundWrapper').style.backgroundImage = "url('./img/classroom.jpeg')";
    document.getElementById('introBlock').style.display = 'none'; // Show the game container
    document.getElementById('gameContainer').style.display = 'inline';
    document.getElementById('introButton').style.display = 'none'; // Hide the start button
    document.getElementById('introBGM').pause();
    document.getElementById('gameBGM').play();

    conversationHistory.push({
        "role": 'user',
        "parts": [{
            "text": `腳本：
                        """
                        遊戲標題：校園戀愛物語：心跳時刻

                        遊戲背景：
                        ${userName}是一位普通的高中生，過著平凡的校園生活。某天，他的生活開始發生變化，因為他開始與三位性格各異的校花展開了不同的愛情故事。${userName}必須在這些關係中做出選擇，決定他未來的戀愛方向。

                        主要角色：
                        ${userName}：主角，普通的高中生。
                        采源：${userName}的采源，性格傲嬌，內心其實很關心${userName}。
                        恩妃學姊：高年級的恩妃學姊，平時言語犀利，但有著溫柔的一面。
                        多賢同學：${userName}的同學，性格天然呆，對${userName}抱有好感。

                        遊戲腳本流程：

                        開場：
                        (場景：教室)
                        ${userName}剛結束一天的課程，正準備回家。
                        選擇A:找采源一起回家。
                        選擇B:去學生會找恩妃學姊聊聊。
                        選擇C:和多賢同學去圖書館做功課。
                        
                        與采源的相處：
                        (場景：回家路上)
                        ${userName}和采源一起走在回家的路上，采源有些不自然地開口。
                        請選擇：
                        選擇A:主動和她聊聊今天發生的事情。
                        選擇B:默默跟在她身後，不打擾她。

                        若選擇A：主動和她聊聊今天發生的事情。
                        采源先是皺了皺眉頭，但很快被你的熱情打動，開始分享她一天中的趣事和煩惱，氣氛變得輕鬆起來。
                        
                        若選擇B：默默跟在她身後，不打擾她。
                        采源一開始感到有些尷尬，但很快主動打破沉默，開始隨意地聊起來，兩人間的氣氛逐漸緩和。

                        選擇A:提議一起去喝飲料。
                        選擇B:提出一起做作業。
                        
                        與恩妃學姊的互動：
                        (場景：學生會)
                        ${userName}在學生會找到了恩妃學姊，恩妃學姊正忙著處理學生會的事務，抬頭看到${userName}。
                        選擇A:主動幫忙處理學生會的事務。
                        選擇B:調侃恩妃學姊，看看她的反應。

                        若選擇A：主動幫忙處理學生會的事務。
                        恩妃學姊對你的主動感到驚訝，但很快露出微笑，接受了你的幫助，兩人合作愉快，氣氛變得融洽。

                        若選擇B：調侃恩妃學姊，看看她的反應。
                        恩妃學姊先是皺起眉頭，隨後反擊回來，兩人之間展開了一場有趣的鬥嘴，彼此之間的距離感逐漸消失。

                        選擇A:邀請恩妃學姊一起去吃飯。
                        選擇B:問恩妃學姊是否需要幫忙解決其他問題。
                        
                        與多賢同學的交流：
                        (場景：圖書館)
                        ${userName}和多賢同學一起去圖書館做功課，多賢同學突然問了一個有趣的問題。
                        選擇A:認真回答她的問題，幫她解惑。
                        選擇B:開玩笑地回答，看看她的反應。

                        若選擇A：認真回答她的問題，幫她解惑。
                        多賢同學對你的耐心感到高興，笑容滿面地感謝你，兩人的關係更加親近。

                        若選擇B：開玩笑地回答，看看她的反應。
                        多賢同學先是愣了一下，隨後哈哈大笑，氣氛變得輕鬆愉快，兩人之間的隔閡逐漸消失。

                        選擇A:問她是否想一起去圖書館。
                        選擇B:提議一起去吃點心。

                        
                        結局：
                        告白成功或失敗:
                        根據選擇的對象與累積的好感度，給予合式的答覆。

                        遊戲結尾:
                        一切都是夢你還沒睡醒嗎"""

                        請根據腳本中的對話，根據"""開場"""到"""與三位女主角互動"""最後到"""結局"""進行，開始一個文字冒險遊戲，每一次的對話，都需要呈現以下格式與資訊：
                        (場景：目前故事的背景為何，或是決定要轉換的場景，場景前不要有其他敘述)
                        在每一次的對話中，你都會根據腳本給我可以選擇的動作，根據我選擇的動作繼續接下來的劇情，整體劇情會圍繞腳本發展。

                        根據我的選擇進行故事就好，不要幫我做出選擇，僅需要給出選項部不需要事先的描述`
        }]
    })
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "contents": conversationHistory,
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE"
                },
            ],
            "generationConfig": {
                "stopSequences": [
                    ""
                ],
                "temperature": 2.0,
                "maxOutputTokens": 2048,
                "topP": 0.8,
                "topK": 10
            }
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(conversationHistory);
            var responseText = data.candidates[0].content.parts[0].text;
            addToConversationHistory('model', responseText);
            displayMessage(responseText, 'bot');
        })
        .catch(error => console.error('Error:', error));
});