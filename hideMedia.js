/**
 * 
 * @typedef {object} modifyFaceHolder
 * @property {function} addPageItem - 添加faceHolder子页面
 */
/**
 * 修改faceHolder相关方法
 * @type {modifyFaceHolder}
 */
const modifyFaceHolder = (() => {
    const faceHolder = document.getElementById("faceHolder");
    const typeList = faceHolder.querySelectorAll(".faceHolderType>span");
    const pageList = faceHolder.querySelector("div:nth-child(2)");
    const initAddPageItem = {};

    const pageDisplayBlock = "display: block; opacity: 1;";
    const pageDisplayNone = "opacity: 1; transform: translateX(10%); display: none;";


    const pageListObserver = new MutationObserver(mutationsList => {
        // @ts-ignore
        const /**@type {Element} */ isPage = mutationsList[0].addedNodes[0];
        if (isPage.className === "emojiContentBox") {
            const index = isPage.getAttribute("index");
            if (initAddPageItem[index]) {
                initCreatePage(index, isPage);
            }
        }
    });
    pageListObserver.observe(pageList, { characterData: true, childList: true, subtree: true });

    /**
     * 
     * @param {number} index - 被添加页面的序号 
     * @param {string} title - 添加子页面标题
     * @param {Element|string} [content] - 添加子页面内容
     */
    function addPageItem(index, title, content) {
        // @ts-ignore
        if (!(content && content.nodeType === 1)) {
            const /**@type {Element} */ addElement = document.createElement("div");
            addElement.setAttribute("style", "height: 100%;width: 100%;");
            // @ts-ignore
            addElement.innerHTML = content;
            content = addElement;
        }

        const isPage = pageList.querySelector(`div[index="${index}"]`);
        if (isPage) {
            // @ts-ignore
            createPage(index, isPage, title, content);
        } else {
            if (!initAddPageItem[index]) {
                initAddPageItem[index] = [];
            }
            initAddPageItem[index].push([title, content]);
        }
    }

    /**
     * 初始化创建相关element以及事件
     * @param {string} index 
     * @param {*} page 
     */
    function initCreatePage(index, page) {
        const emojiPage = page.querySelector(".emojiPage");
        const emojiContent = page.querySelector(".emojiContent");
        const emojiPageItem = emojiPage.querySelectorAll("span");

        // 获取当前主题emojiPageItem选中颜色
        let electStyle = emojiPage.querySelector("span[style]").getAttribute("style");

        // emojiPageItem切换
        emojiPage.addEventListener("click", event => {
            if (event.target.classList.contains("faceHolderPageItem")) {
                emojiPage.querySelectorAll("span").forEach(item => {
                    item.setAttribute("style", "");
                });
                event.target.setAttribute("style", electStyle);

                emojiContent.querySelectorAll(":scope > div").forEach(item => {
                    if (event.target.getAttribute("p") == item.getAttribute("index")) {
                        item.setAttribute("style", pageDisplayBlock);
                    } else {
                        item.setAttribute("style", pageDisplayNone);
                    }
                });
            }
        });

        // 添加emojiPage
        initAddPageItem[index].forEach((item, index) => {
            // item
            const newItem = document.createElement("span");
            newItem.className = "faceHolderPageItem";
            newItem.textContent = item[0];
            newItem.setAttribute("p", emojiPageItem.length + index);
            emojiPage.appendChild(newItem);

            // content
            const newContent = document.createElement("div");
            newContent.className = "faceHolderBoxChild textColor panelHolderItem";
            newContent.setAttribute("index", emojiPageItem.length + index);
            newContent.setAttribute("style", pageDisplayNone);
            newContent.appendChild(item[1]);
            emojiContent.appendChild(newContent);
        });
    }

    /**
     * 
     * @param {number} index 
     * @param {*} page 
     * @param {string} title 
     * @param {Element} content 
     */
    function createPage(index, page, title, content) {
        const emojiPage = page.querySelector(".emojiPage");
        const emojiContent = page.querySelector(".emojiContent");
        const emojiPageItem = emojiPage.querySelectorAll("span");

        // item
        const newItem = document.createElement("span");
        newItem.className = "faceHolderPageItem";
        newItem.textContent = title;
        newItem.setAttribute("p", emojiPageItem.length + index);
        emojiPage.appendChild(newItem);

        // content
        const newContent = document.createElement("div");
        newContent.className = "faceHolderBoxChild textColor panelHolderItem";
        newContent.setAttribute("index", emojiPageItem.length + index);
        newContent.setAttribute("style", pageDisplayNone);
        newContent.appendChild(content);
        emojiContent.appendChild(newContent);

    }
    return {
        addPageItem
    };
})();

const htmlList = [
    '',
    '<style>',
    '.reifuu-plugin-bstluo-musicButton{',
    '    background-color: #dedede;',
    '    border: #dedede;',
    '}',
    '',
    '.reifuu-plugin-bstluo-musicButton:hover{',
    '    background-color: #c2c2c2;',
    '    border: #c2c2c2;',
    '}',
    '',
    '.reifuu-plugin-bstluo-musicButton:active{',
    '    background-color: #969696;',
    '    border: #969696;',
    '}',
    '</style>',
    '<div',
    'style="height: 100%;width: 100%;background-color: #F0F0F0;display: flex;flex-direction: column;justify-content: center;">',
    '<div',
    '    style="width: 100%;height: 10%;display: flex;flex-direction: column;justify-content: center;align-items:center">',
    '    <input type="url" id="reifuu-plugin-bstluo-musicInput" class="reifuu-plugin-bstluo-musicInput"',
    '        style="width: 90%;height: 100%;background-color: #dedede;border: #dedede;" placeholder="请输入网易云歌曲链接或者歌曲id"></input>',
    '</div>',
    '',
    '<div',
    '    style="width: 100%;height: 10%;display: flex;flex-direction: column;justify-content: center;align-items:center;">',
    '</div>',
    '',
    '<div',
    '    style="width: 100%;height: 10%;display: flex;flex-direction: column;justify-content: center;align-items:center">',
    '    <button id="reifuu-plugin-bstluo-musicButton" class="reifuu-plugin-bstluo-musicButton" style="width: 20%;height: 100%;border-radius: 10px;">点 播</button>',
    '</div>',
    '</div>',
    ''
];

const addElement = document.createElement("div");
addElement.setAttribute("style", "height: 100%;width: 100%;");
// @ts-ignore
addElement.innerHTML = htmlList.join('\n');

const button = addElement.getElementsByClassName("reifuu-plugin-bstluo-musicButton")[0];

button.addEventListener('click', (e) => {

    const urlDom = document.getElementById('reifuu-plugin-bstluo-musicInput');
    let url = urlDom.value;

    // https://music.163.com/song?id=1924062187&userid=582785446
    // https://music.163.com/playlist?id=6643543480&userid=582785446

    url = url.replace(/https:\/\/music.163.com\/(#\/)*([\s\S]+)\?/, 'https://xc.null.red:8043/meting-api/?');
    if (/^(\d+)$/.test(url)) { url = url.replace(/(\d+)/, 'https://xc.null.red:8043/meting-api/?id=$1'); }

    Urls.helper + 'lib/php/function/loadImg.php?s=' + encodeURIComponent(url);
    try {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            // const data = await res.json()
            // console.log(data);
            if (!res.ok) {
                throw new Error(); // Will take you to the `catch` below
            }
            return res.json();
        }).then(res => {
            const typeMap = {
                music: 0,
                video: 1,
            };

            const data = JSON.stringify({
                // b: `=${typeMap[type]}`,
                n: '0',
                c: res.pic.substr(4),
                d: Math.round(res.time / 1000),
                n: res.name,
                o: res.url.substr(4),
                r: res.auther,
                s: res.url.substr(4),
            });

            socket.send(`&1${data}`);

            urlDom.value = '';

            _alert("成功点歌啦");
        }).catch(error => {
            // Do something useful with the error
            console.log(error);

            _alert("点歌失败了！");
        });
    } catch (err) {
        console.log(err);

        _alert("点歌失败了！");
    }
});

modifyFaceHolder.addPageItem('6', '隐式点歌', addElement);
