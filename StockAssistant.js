let i = 0;
let inject;

inject = setInterval(() => {
    if (i >= 1) {
        console.log('注入成功！')
        _alert('[StockAssistant] 插件启动成功')
        clearInterval(inject)
        start()
        return
    }
    if (!socket.hasOwnProperty("_onmessage")) { return console.log("页面未加载完全！注入失败，等待重新注入") }

    i = 1;
    /**
     * 代理函数
     * 在执行前调用回调
     * @param {function(...any): any} targetFunction 目标函数
     * @param {function(Array<any>, function(...any): any): boolean} callback 回调返回true则不执行目标函数
     * @returns {function(...any): any}
     */
    function proxyFunction(targetFunction, callback) {
        return ((...param) => {
            if (callback(param, targetFunction) != true)
                return targetFunction(...param)
        });
    }


    socket.send = proxyFunction(socket.send.bind(socket), (p) => {
        //console.log("send", p)
        sendStock(p)
    });
    socket._onmessage = proxyFunction(socket._onmessage.bind(socket), (p) => {
        //console.log("onMessage", p)
        onStock(p)
    });


}, 1000)

let nowStock = {
    totalStock: 0,
    totalMoney: 0,
    unitPrice: 0,
    personalStock: 0,
    personalMoney: 0
}
let isInit = 0

let stockStatus = {
    unitPrice: 999,
    personalStock: 0,
    up: 0,
    down: 0
}

const start = () => {
    setInterval(() => {
        socket.send('>#')
    }, 1000)
}

const sendStock = (inData) => {
    if (isInit == 0) { return }
    //console.log('inData', inData)
    //console.log('status', stockStatus)
    if (inData[0].substr(0, 2) === '>$') {
        // buy
        stockStatus.unitPrice = nowStock.unitPrice
        const buy = inData[0].match(/>\$(\d+)/)
        stockStatus.personalStock = nowStock.personalStock + Number(buy[1])
        //_alert(`您购买了${buy[1]}股，当前持股：${stockStatus.personalStock}`)

    } else if (inData[0].substr(0, 2) === '>@') {
        // sell
        const sell = inData[0].match(/>\@(\d+)/)

        stockStatus.personalStock = stockStatus.personalStock - Number(sell[1])
        //_alert(`您卖出了${sell[1]}股，当前持股：${stockStatus.personalStock}`)

    } else {
        return
    }
}

const onStock = (inData) => {
    if (inData[0].substr(0, 1) !== '>') { return }

    const list = inData[0].substr(1).split('>')[0].split('"')
    if (list.length == 5) {
        const data = {
            totalStock: Number(list[0]),
            totalMoney: Number(Number(list[1]).toFixed(2)),
            unitPrice: Number(Number(list[2]).toFixed(2)),
            personalStock: Number(list[3]),
            personalMoney: Number(list[4])
        }

        if (isInit == 0) {
            isInit = 1
            stockStatus.personalStock = data.personalStock
            if (data.personalStock > 0) { stockStatus.unitPrice = data.unitPrice }
            stockStatus.down = 0
            stockStatus.up = 0
            console.log(`缓存股票数据初始化成功！`)
            nowStock = data
        }

        if (JSON.stringify(nowStock) === JSON.stringify(data)) { return }

        let outMsg = ''
        if (data.personalStock > 0) {
            if ((data.unitPrice - stockStatus.unitPrice) > 0) {
                outMsg = '\n当前股票与你的购买价格关系：+' + (data.unitPrice - stockStatus.unitPrice).toFixed(2)
            } else if (data.unitPrice - stockStatus.unitPrice < 0) {
                outMsg = '\n当前股票与你的购买价格关系：' + (data.unitPrice - stockStatus.unitPrice).toFixed(2)
            }
        }
        let outMsg2 = ''

        if ((data.unitPrice - nowStock.unitPrice).toFixed(2) >= 0) {
            outMsg2 = `变化幅度：+${(data.unitPrice - nowStock.unitPrice).toFixed(2)}`
        } else {
            outMsg2 = `变化幅度：${(data.unitPrice - nowStock.unitPrice).toFixed(2)}`
        }

        if (nowStock.unitPrice < data.unitPrice) {
            stockStatus.up = stockStatus.up + 1
            stockStatus.down = 0
            const msgTemp = `[UP] 当前是上涨趋势，已经连续涨${stockStatus.up}次力，当前股价为: ${data.unitPrice}，上次股价为：${nowStock.unitPrice}\n`
            const alertMsg = `${msgTemp}${outMsg2}${outMsg}`
            console.log(alertMsg)
            _alert(alertMsg)
        }

        if (nowStock.unitPrice > data.unitPrice) {
            stockStatus.up = 0
            stockStatus.down = stockStatus.down + 1
            const msgTemp = `[Down] 当前是下跌趋势，已经连续跌${stockStatus.down}次力，当前股价为: ${data.unitPrice}，上次股价为：${nowStock.unitPrice}\n`
            const alertMsg = `${msgTemp}${outMsg2}${outMsg}`
            console.log(alertMsg)
            _alert(alertMsg)
        }

        nowStock = data

        const rate = (nowStock.personalStock * nowStock.unitPrice) / (nowStock.personalStock * stockStatus.unitPrice)

        if (nowStock.unitPrice > stockStatus.unitPrice) {
            _alert(`您上次购买股票，单价为 ${stockStatus.unitPrice} 钞钞，当前股价为 ${nowStock.unitPrice} 钞钞，收益为：${(nowStock.personalStock * nowStock.unitPrice) - (nowStock.personalStock * stockStatus.unitPrice)
                }`)
        }

        if (rate <= 0.5) {
            _alert('报警！！您的亏损率已达到50%，请注意查看，提前卖出')
        } else if (rate <= 0.85) {
            _alert('报警！！您的亏损率已达到15%，请注意查看，提前卖出')
        }

    } else { return }
}
