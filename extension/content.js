// 当页面及所有依赖资源完全加载后执行
let timerId = null; // 用于存储定时器ID的变量

window.addEventListener('load', () => {
    // 使用 setInterval 定期发送消息到背景脚本请求当前标签页的URL和ID
    timerId = setInterval(() => {
        chrome.runtime.sendMessage({action: "fetchData"}, function(response) {
            if (response && response.data) {
                handleData(response.data);
            } else {
                console.error('No response or missing data');
            }
        });
    }, 1000); // 每1000毫秒（1秒）执行一次
});

function handleData(data) {
    fetch(`http://localhost:3000/api/account?website=${encodeURIComponent(data.url)}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(userData => {
        //console.log(userData);  // 打印看看返回的数据结构
        const usernameInputs = document.querySelectorAll('input[type="email"], input[type="text"][name*="user"], input[type="text"][id*="user"], input[type="text"][autocomplete="username"]');
        const passwordInputs = document.querySelectorAll('input[type="password"], input[autocomplete="current-password"]');
        // 檢查是否有用戶名輸入框
		if (usernameInputs.length > 0) {
			// 如果有，則遍歷每個用戶名輸入框並填入用戶名
			for (let input of usernameInputs) {
				input.value = userData[0].username;
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}

		// 檢查是否有密碼輸入框
		if (passwordInputs.length > 0) {
			// 如果有，則遍歷每個密碼輸入框並填入密碼
			for (let input of passwordInputs) {
				input.value = userData[0].password;
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
    })
    .catch(error => {
        console.error('Error fetching password:', error);
        //alert('Failed to fetch password: ' + error.message);
    });
}
