// main.js

/*
        0   1       2   3       4       5       6               7       __
 ____|\ _______________________________________________________________/  \
|      \                                                              | /\ |
|____  /___________________          ____________     ____     _______| \/ |
     |/                   /    /\    \           \    \  /    /        \__/
                _________/    /  \    \_____      \    \/    /
               /             /    \         \      \        /
              /    _________/      \_____    \     /        \
             /    /                      \    \   /    /\    \        __  __
 ____|\ ____/    /________________________\    \_/    /__\    \_______\ \/ /
|      \                                                               \  /
|____  /_______________________________________________________________/  \
     |/                                                               /_/\_\

*/

// 替换所有x为val
Array.prototype.replace = function (x, val) {
    for (var i = 0; i < this.length; ++i)
        if (this[i] === x)
            this[i] = val;
    return this;
}
// 所有v1互换v2
Array.prototype.exchange = function (v1, v2) {
    for (var i = 0; i < this.length; ++i)
        if (this[i] === v1)
            this[i] = v2;
        else if (this[i] === v2)
            this[i] = v1
    return this;
}
// 返回第一个大于等于x的数的下标
Array.prototype.lowerBound = function (x) {
    var first = 0, middle, len = this.length, half
    while (len > 0) {
        half = len >> 1
        middle = first + half
        if (this[middle] < x) {
            first = middle + 1
            len = len - half + 1
        } else {
            len = half
        }
    }
    return first
}
// 以pos对应的概率随机选择opt中一个元素
function lottery (opt, pos) {
    pos = pos || Array.apply(null, new Array(opt.length)).map(function(){return 1})
    var sum = pos.reduce(function(i, j) { return i+j})
    var ran = Math.random()*sum
    for (var i = 0; i < opt.length; ++i) {
        if (ran > pos[i]) ran -= pos[i]
        else return opt[i]
    }
    return undefined
}
// 生成随机路径数组v2
function gen2(pre) {
    var l = pre + Math.random()*10
    var ps = [0, 0, 0]
    for (var i = ps.length-1; i < l; ++i) {
        switch (ps[i]) {
            case 0: case 3: case 5: case 6: ps.push(lottery([0,1,4,6], [3,2,2,2])); break
            case 1: case 2: case 4: ps.push(lottery([2,3,5], [6,3,3])); break
            default: break
        }
    }
    switch (ps[i]) {
        case 1: case 2: case 4: ps.push(lottery([3,5]), 0)
        default: ps.push(0,0,7); break;
    }
    return ps
}

var stats = new Stats()
document.getElementById('bg').appendChild(stats.domElement)

var sprites = {
    "paths": [
        { "width": 400, "height": 71*1, "offset": { "x": 0, "y": 71*16 } },
        { "width": 400, "height": 71*2, "offset": { "x": 0, "y": 71*14 } },
        { "width": 400, "height": 71*1, "offset": { "x": 0, "y": 71*13 } },
        { "width": 400, "height": 71*2, "offset": { "x": 0, "y": 71*11 } },
        { "width": 400, "height": 71*2, "offset": { "x": 0, "y": 71*9 } },
        { "width": 400, "height": 71*2, "offset": { "x": 0, "y": 71*7 } },
        { "width": 400, "height": 71*5, "offset": { "x": 0, "y": 71*2 } },
        { "width": 400, "height": 71*2, "offset": { "x": 0, "y": 0 } },
    ],
    "arrow": { "width": 98, "height": 107, "offset": { "x": 0, "y": 71*17 } },
    "monster": { "width": 90, "height": 90, "offset": { "x": 98, "y": 71*17 } },
    "tree": { "width": 45, "height": 127, "offset": { "x": 188, "y": 71*17 } },
}

var spritesimg = new Image()
spritesimg.src = "sprites.png"

var ps = gen2(50)
// ps = [0,0,6,0,0,0,0,7]
console.log(ps)

function drawImage(ctx, sprite, x, y) {
    ctx.drawImage(spritesimg,
        sprite.offset.x, sprite.offset.y, sprite.width, sprite.height,
        x, y, sprite.width, sprite.height)
}

spritesimg.onload = function () {
    // 路径总和
    var n = ps.length
    // var pheight = ps.reduce(function(sum, x) { return sum+sprites.paths[x].height }, 0)
    var pheight = 0
    var ws = ps.map(function(i) { return pheight += sprites.paths[i].height })
    console.log(pheight)

    // 隐藏的全景画布
    var offcan = document.createElement('canvas')
    var offctx = offcan.getContext('2d')
    offcan.width = 400
    offcan.height = pheight
    ps.slice().reverse().reduce(function (y, i) {
        drawImage(offctx, sprites.paths[i], 0, y)
        return y+sprites.paths[i].height
    }, 0)

    // 计算全局中可以改变通道的下标索引
    var str = ps.join('')
    var re = /(12*3)|(42*5)|6/g
    var li = [[], []]
    var ls = false
    while (tmp = re.exec(str)) {
        switch(str[tmp.index]) {
            case '1': li[0].push(tmp.index); break;
            case '4': li[1].push(tmp.index); break;
            case '6': ls = !ls; li.reverse(); break;
        }
    }
    if (ls) { li.reverse(); ls = false }
    console.log(li[0], li[1])

    function helper(i, tp, a, b, c) {
        // var lii = li[/*0*/a].indexOf(i)
        if (li[0].concat(li[1]).indexOf(i) === -1) {
            if (!ls) tp.replace(/*2*/c, lottery(/*[1,2]*/b))
            else if (tp[0] === c) tp[lottery([0,1])] = lottery(b)
        } else { // 如果是改变路径
            if (ls && tp[0] === /*2*/c) { // 已经在同一路径上
                if (li[/*0*/a].indexOf(i) === li[a].length - 1) { // 之后不存再改变路径
                    tp[lottery([0, 1])] = 1; //选择其中一个改变路径
                    ls = false
                } else { //否则选择其中一个改变路径或者不改变
                    tp[lottery([0, 1])] = lottery(/*[1, 2]*/b);
                    ls = (tp.indexOf(1) === -1)
                }
            } else if (!ls) { // 不再同一路径上，之后还存在改变路径
                if (li[[1,0][a]].some(function (x) { return x > i})) {
                    tp.replace(/*2*/c, lottery(/*[1,2]*/b)); // 改变或不改变路径
                    ls = (tp.indexOf(1) !== -1)
                }
            }
        }
        return tp
    }
    // 每条路径都有两个箭头，随机生成在路径上的哪个通道
    var sp = [[0,2],]
    for (var i = 1; i < n; ++i) {
        var tp = sp[i-1].slice()
        switch (ps[i-1]) {
            case 3: tp.replace(1,0); break
            case 5: tp.replace(1,2); break
            case 6: tp.exchange(0,2); li.reverse(); break
            default: break
        }
        switch (ps[i]) {
            case 1: sp.push(helper(i, tp, 0, [1,2], 2)); break;
            case 4: sp.push(helper(i, tp, 1, [0,1], 0)); break;
            default: sp.push(tp); break;
        }
    }
    // sp.forEach(function (x) { console.log(x)})

    // 左中右
    var pos = [43, 150, 257];
    var pause = 0
    // 屏幕画布
    var can = document.createElement('canvas')
    var ctx = can.getContext('2d')
    can.width = 400
    can.height = Math.max(400, document.documentElement.clientHeight)
    document.getElementById('game').appendChild(can)

    function Arrow (id, x, y, v, a) {
        this.id = id
        this.x = x
        this.y = y
        this.v = v
        this.a = a
        this.p = 0
        this.pause = false
    }
    Arrow.prototype.move = function (fn) {
        if (this.pause) return
        this.v += this.a
        this.y += this.v
        if (this.y + sprites.arrow.height > pheight - 90) {
            this.y = pheight - 90 - sprites.arrow.height
            this.pause = true
            return
        }
        // if (pause) return
        while (this.p < n && this.y >= ws[this.p]) this.p++
        // console.log(ps[this.p])
        this.x = fn(ps[this.p], sp[this.p][this.id],
            this.x, this.y - (ws[this.p] - sprites.paths[ps[this.p]].height))
    }

    var arr1 = new Arrow(0, pos[0], 0, 10, 0)
    var arr2 = new Arrow(1, pos[2], 0, 6, 0)

    function fmult (pid, cid, x, y) {
        if (cid === 0 || cid === 2) if (pid != 6) return pos[cid]
        if (pid === 2 && cid === 1) return pos[cid]
        switch (pid) {
            case 6:
                if (y < 30) return pos[cid]
                else if (y > 240) return pos.slice().reverse()[cid]
                else return (cid === 0 ? y+15 : 285-y)
            case 1: case 4:
                if (y > 80) return pos[1]
                else return (pid === 1 ? 255-y*21/16 : 45+y*21/16)
            case 3: case 5:
                if (y > 60) return pos[pid == 3 ? 0 : 2]
                else return (pid === 3 ? 150-y*7/4 : 150+y*7/4)
        }
    }
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) pause = !pause;
        else if (e.keyCode === 32) {
            arr1 = new Arrow(0, pos[0], 0, 10, 0)
            arr2 = new Arrow(1, pos[2], 0, 10, 0)
            pause = 0
        }
    }, true)


    function lookAt() {
        var camy = pheight - ((arr1.y + arr2.y)/2 + sprites.arrow.height/2) + can.height/2
        if (camy > pheight) camy = pheight
        if (camy - can.height < 0) camy = can.height
        return camy;
    }

    function render(camy) {
        ctx.drawImage(offcan, 0, camy - can.height, can.width, can.height,
                0, 0, can.width, can.height)
        drawImage(ctx, sprites.arrow, arr1.x,
            pheight - arr1.y - sprites.arrow.height - (camy - can.height))
        drawImage(ctx, sprites.arrow, arr2.x,
            pheight - arr2.y - sprites.arrow.height - (camy - can.height))
    }
    render(lookAt())
    window.onresize = function() {
        can.height = Math.max(400, document.documentElement.clientHeight)
        render(lookAt())
    }
    function animate() {
        stats.update();

        if (!pause) {
            arr1.move(fmult)
            arr2.move(fmult)
            render(lookAt())
            // if (Math.abs(arr1.y - arr2.y) - sprites.arrow.height> can.height/2) {
            if (Math.abs(arr1.y - arr2.y) - sprites.arrow.height> 300) {
                tmp = arr1.v
                arr1.v = arr2.v
                arr2.v = tmp
            }
            if (arr1.pause && arr2.pause) pause = true
        }
            render(lookAt())
        requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
}
