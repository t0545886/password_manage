document.addEventListener('DOMContentLoaded', function() {
    const fillButton = document.getElementById('fill');
    if (fillButton) {
        fillButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var currentTab = tabs[0];
                if (currentTab) {
					//console.log(currentTab.url);
                    fetch(`http://localhost:3000/api/account?website=${encodeURIComponent(currentTab.url)}`, {
                        method: 'GET',
                    })
                    .then(response => response.json())
                    .then(data => {
                        chrome.scripting.executeScript({
                            target: {tabId: tabs[0].id},
                            func: function(userData) {
								
								//console.log(userData);  // 打印看看返回的數據結構
                                // 使用更详细的选择器来识别用户名输入框，考虑type、name、id和autocomplete属性
								const usernameInputs = document.querySelectorAll('input[type="email"], input[type="text"][name*="user"], input[type="text"][id*="user"], input[type="text"][autocomplete="username"]');
								// 识别密码输入框，增加对autocomplete属性的检查
								const passwordInputs = document.querySelectorAll('input[type="password"], input[autocomplete="current-password"]');
                                for (let input of usernameInputs) {
                                    input.value = userData[0].username;
									input.dispatchEvent(new Event('input', { bubbles: true })); // 在这里触发 input 事件
                                }
                                for (let input of passwordInputs) {
                                    input.value = userData[0].password;
									input.dispatchEvent(new Event('input', { bubbles: true })); // 在这里触发 input 事件
                                }
                            },
                            args: [data] // 直接將 data 對象作為參數傳遞
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching password:', error);
                        alert('Failed to fetch password: ' + error.message);
                    });
                }
            });
        });
    } else {
        console.error('The element with ID "fill" was not found.');
        alert('Button element not found!');
    }
});
