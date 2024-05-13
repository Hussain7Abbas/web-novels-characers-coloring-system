// new : https://pastebin.com/api/api_post.php
// res : https://pastebin.com/UIFdu235s

const api_dev_key = 'NXWoHirchfcfCa6YM9Hx5ePKNmVYjuuB'

const newPaste = (title, body, format) => {
    var data = new FormData();
    data.append('api_dev_key', api_dev_key);
    data.append('api_option', 'paste');
    data.append('api_paste_name', title);
    data.append('api_paste_code', body);
    data.append('api_paste_format', format);
    data.append('api_paste_private', '2');
    data.append('api_paste_expire_date', 'N');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://pastebin.com/api/api_post.php', true);
    xhr.onload = function () {
        // do something to response
        console.log(this.responseText);
    };
    xhr.send(data);
}

export {newPaste} 