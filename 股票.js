(function () {
    'use strict';
    let observerOptions = { childList: true, subtree: true };
    let targetNode = document.querySelector('div#mainHolderBox.fullBox div#movePanelHolder');// 获取监听 DOM 对象
    let i = 0;
    let time = 0;

    targetNode.style.removeProperty('box-shadow')
    targetNode.style.removeProperty('opacity')

    if (document.querySelector('div#stockHolder div:nth-child(1) span:nth-child(3)')) {
        const main = document.querySelector('div#stockHolder.panelHolderItem').children
        console.log(main)
        const data = {
            title: main[1],
            mainFrame: main[2],
            button: main[3]
        }
        data.title.children[0].addEventListener("click", function () {
            i++;
            if (i > 1) { i = 0 }
            if (i == 0) { data.mainFrame.style.visibility = "visible"; data.button.style.visibility = "visible"; }
            if (i == 1) { data.mainFrame.style.visibility = "hidden"; data.button.style.visibility = "hidden"; }
        });
        open(data)
    } else {
        const callback = (mutationList, observer) => {
            const main = mutationList[0].addedNodes[0].children;
            
            if (main) {
                const data = {
                    title: main[1],
                    mainFrame: main[2],
                    button: main[3]
                }

                data.title.children[0].addEventListener("click", function () {
                    i++;
                    if (i > 1) { i = 0 }
                    if (i == 0) { data.mainFrame.style.visibility = "visible"; data.button.style.visibility = "visible"; }
                    if (i == 1) { data.mainFrame.style.visibility = "hidden"; data.button.style.visibility = "hidden"; }
                });

                open(data)
                observer.disconnect();
            }
        }
        let observer1 = new MutationObserver(callback);
        observer1.observe(targetNode, observerOptions);
    }

    function open(data) {
        var valueObserver = new MutationObserver((mutations) => {
            const up = data.mainFrame.querySelector('div#stockHolder div:nth-child(1) span.whoisValueUp')
            const down = data.mainFrame.querySelector('div#stockHolder div:nth-child(1) span.whoisValueDown')
            if (time === 0) { time = 1; data.title.children[0].innerHTML = `股价：${mutations[0].addedNodes[0].nodeValue}`; }

            if (up) { data.title.children[0].innerHTML = `股价：${mutations[0].addedNodes[0].nodeValue} <span style="transform:scale(.7);margin-right:6px;display:inline-block;position:relative;top:1px;color: rgba(0,255,0,0.7)">${up.innerHTML}</span>`; }
            if (down) { data.title.children[0].innerHTML = `股价：${mutations[0].addedNodes[0].nodeValue} <span style="transform:scale(.7);margin-right:6px;display:inline-block;position:relative;top:1px;color: rgba(255,0,0,0.7)">${down.innerHTML}</span>`; }
        });
        valueObserver.observe(data.mainFrame.querySelector('#stockHolder div:nth-child(1) span:nth-child(3)'), { childList: true, subtree: true });
    }
})();
