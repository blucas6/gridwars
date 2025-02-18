/* TABLE */
var grid = document.getElementById('grid')
var passturnBtn = document.getElementById('pass')
var turnTxt = document.getElementById('turn')

/* BOX */
var getBox1 = document.getElementById('getBox1')
var getBox2 = document.getElementById('getBox2')
var peopleBox1 = document.getElementById('peopleBox1')
var peopleBox2 = document.getElementById('peopleBox2')

/* TEXT */
var rules_terr = document.getElementById('rules_terr')
var rules_ind = document.getElementById('rules_ind')
var territoriesTxt1 = document.getElementById('territories1')
var territoriesTxt2 = document.getElementById('territories2')
var peopleTxt1 = document.getElementById('people1')
var peopleTxt2 = document.getElementById('people2')
var moneyTxt1 = document.getElementById('money1')
var moneyTxt2 = document.getElementById('money2')
var industryTxt1 = document.getElementById('ind1')
var industryTxt2 = document.getElementById('ind2')
var player1info = document.getElementById('player1info')
var player2info = document.getElementById('player2info')

/* BUTTONS */
var buyPeople1 = document.getElementById('buyPeople1')
var buyPeople2 = document.getElementById('buyPeople2')
var buyInd1 = document.getElementById('buyInd1')
var buyInd2 = document.getElementById('buyInd2')
var buyArmy1 = document.getElementById('buyArmy1')
var buyArmy2 = document.getElementById('buyArmy2')

/* GAME VARIABLES */
var ind_cost = 12
var ind_prod = 3
var terr_prod = 3
var size = 7

/* VARIABLES */
var turn = 0
var player_turn = 1
var territory
var obj_array
var army_array
var tmp_army
var player1
var player2
var mouse = "neutral"

class Player {
    constructor(team) {
        this.money = 30
        this.territory = 4
        this.people = 0
        this.industry = 0
        this.team = team
    }
}

class Army {
    constructor(x, y, people, team) {
        this.move = 1
        this.x = x
        this.y = y
        this.people = people
        this.team = team
    }
}

class Industry {
    constructor(x, y, team) {
        this.x = x
        this.y = y
        this.team = team
    }
}

setup()
play()

passturnBtn.addEventListener('click', () => {
    if(mouse == "neutral") {
        turn++
        if(turn % 2 == 0) {
            turnTxt.innerText = "Turn: Player 1"
            player_turn = 1
        } else if(turn % 2 == 1) {
            turnTxt.innerText = "Turn: Player 2"
            player_turn = 2
        }
        render()
        play()
    }
})

buyPeople1.addEventListener('click', () => {
    if (player_turn == 1) 
    {
        if (player1.money - 2 >= 0) 
        {
            player1.money -= 2
            player1.people++
        }
    }
    renderText()
})
buyPeople2.addEventListener('click', () => {
    if (player_turn == 2) 
    {
        if (player2.money - 2 >= 0) 
        {
            player2.money -= 2
            player2.people++
        }
    }
    renderText()
})

buyArmy1.addEventListener('click', () => {
    if(player_turn == 1) {
        if(player1.money - 10 >= 0 && player1.people > 0) {
            player1.money -= 10
            let box = document.createElement('div')
            box.className = "Ibox"
            box.innerText = "A"
            box.addEventListener('click', () => {
                if(mouse != "neutral") {
                    mouse = "neutral"
                    box.classList.remove("clicked")
                } else {
                    mouse = "army"
                    box.classList.add("clicked")
                }
            })
            getBox1.append(box)
        }
        renderText()  
    }
})
buyArmy2.addEventListener('click', () => {
    if(player_turn == 2) {
        if(player2.money - 10 >= 0 && player2.people > 0) {
            player2.money -= 10
            let box = document.createElement('div')
            box.className = "Ibox"
            box.innerText = "A"
            box.addEventListener('click', () => {
                if(mouse != "neutral") {
                    mouse = "neutral"
                    box.classList.remove("clicked")
                } else {
                    mouse = "army"
                    box.classList.add("clicked")
                }
            })
            getBox2.append(box)
        }
        renderText()  
    }
})

buyInd1.addEventListener('click', () => {
    if (player_turn == 1) 
    {
        if (player1.money - ind_cost >= 0) 
        {
            player1.money -= ind_cost
            player1.industry++
            let box = document.createElement('div')
            box.className = "Ibox"
            box.innerText = "I"
            box.addEventListener('click', () => {
                if(mouse != "neutral") {
                    mouse = "neutral"
                    box.classList.remove("clicked")
                } else {
                    mouse = "industry"
                    box.classList.add("clicked")
                }
            })
            getBox1.append(box)
        }
        renderText()  
    }
})
buyInd2.addEventListener('click', () => {
    if (player_turn == 2) 
    {
        if (player2.money - ind_cost >= 0) 
        {
            player2.money -= ind_cost
            player2.industry++
            let box = document.createElement('div')
            box.className = "Ibox"
            box.innerText = "I"
            box.addEventListener('click', () => {
                if(mouse != "neutral") {
                    mouse = "neutral"
                    box.classList.remove("clicked")
                } else {
                    mouse = "industry"
                    box.classList.add("clicked")
                }
            })
            getBox2.append(box)
        }
        renderText()  
    }
})

function setup() {
    territory = make2DArray()
    obj_array = make2DArray()
    player1 = new Player(1)
    player2 = new Player(2)
    renderText()
    for(let i=0; i<size; i++) {
        let row = document.createElement('tr')
        grid.append(row)
        for(let j=0; j<size; j++) {
            let col = document.createElement('td')
            col.innerHTML = "&nbsp"
            col.addEventListener('click', () => {
                handleMouseClick(col, i, j)
                renderText()
            })
            row.append(col)
        }
    }
    rules_terr.innerText = "Territories - Conquering gains $"+terr_prod
    rules_ind.innerText = "Industries - produce $"+ind_prod+" per turn"
    territory[0][0] = 1
    territory[0][1] = 1
    territory[1][0] = 1
    territory[1][1] = 1
    territory[size-1][size-1] = 2
    territory[size-2][size-1] = 2
    territory[size-1][size-2] = 2
    territory[size-2][size-2] = 2
    turnTxt.innerText = "Turn: Player 1"
    render()
}

function end(winner) {
    let winTxt = document.createElement('h1')
    winTxt.innerText = "WINNER!!"
    if(winner.team == 1) {
        player1info.append(winTxt)
        console.log("WIN PLAYER 1")
    }
    if(winner.team == 2) {
        player2info.append(winTxt)
        console.log("WIN PLAYER 2")
    }
}

function play() {
    if(player1.territory == 0 || player1.territory == player1.industry) {
        end(player2)
    }
    if(player2.territory == 0 || player2.territory == player2.industry) {
        end(player1)
    }
    if(player_turn == 1) {
        let coin1 = 0
        if(player_turn)
        if(turn > 2) { coin1 += Math.floor((player1.money / 10)) }
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(obj_array[i][j] instanceof Industry && territory[i][j] == 1) { 
                    coin1 += ind_prod
                }
                if(obj_array[i][j] instanceof Army) {
                    obj_array[i][j].move = 1
                }
            }
        }
        player1.money += coin1
    } else if(player_turn == 2) {
        let coin2 = 0
        if(turn > 2) { coin2 += Math.floor((player2.money / 10)) }
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                if(obj_array[i][j] instanceof Industry && territory[i][j] == 2) { 
                    coin2 += ind_prod
                }
                if(obj_array[i][j] instanceof Army) {
                    obj_array[i][j].move = 1
                }
            }
        }
        player2.money += coin2
    }
    renderText()
}

function handleMouseClick(col, i, j) {
    switch(mouse) {
        case "neutral":
            if(obj_array[i][j] instanceof Army) {          // ARMY SET HIGHLIGHT
                if(obj_array[i][j].move > 0 && obj_array[i][j].team == player_turn) {
                    highlight(i, j, obj_array[i][j].team)
                    mouse = "armymove"
                    tmp_army = obj_array[i][j]
                    tmp_army.x = i
                    tmp_army.y = j
                    obj_array[i][j] = null
                }
            }
            break
        case "armymove":
            if(col.style.backgroundColor != "white" && col.style.backgroundColor != "red" && col.style.backgroundColor != "blue") { // check if spot chosen is highlighted
                if(player_turn == 1) {
                    if(obj_array[i][j] instanceof Army) {
                        attacker = tmp_army
                        defender = obj_array[i][j]
                        obj_array[i][j] = battle(attacker, defender)
                        if(obj_array[i][j] != null) {
                            obj_array[i][j].move -= 1
                            mouse = "neutral"
                            territory[i][j] = obj_array[i][j].team
                            if(territory[i][j] != defender.team) {
                                player1.money += terr_prod
                            }
                        }
                        render()
                    } else {
                        obj_array[i][j] = tmp_army
                        obj_array[i][j].move -= 1
                        if(territory[i][j] != obj_array[i][j].team) {
                            player1.money += terr_prod
                        }
                        mouse = "neutral"
                        territory[i][j] = 1
                        render()
                    }
                } else if(player_turn == 2) {
                    if(obj_array[i][j] instanceof Army) {
                        attacker = tmp_army
                        defender = obj_array[i][j]
                        obj_array[i][j] = battle(attacker, defender)
                        if(obj_array[i][j] != null) {
                            obj_array[i][j].move -= 1
                            mouse = "neutral"
                            territory[i][j] = obj_array[i][j].team
                            if(territory[i][j] != defender.team) {
                                player2.money += terr_prod
                            }
                        }
                        render()
                    } else {
                        obj_array[i][j] = tmp_army
                        obj_array[i][j].move -= 1
                        if(territory[i][j] != obj_array[i][j].team) {
                            player2.money += terr_prod
                        }
                        mouse = "neutral"
                        territory[i][j] = 2
                        render()
                    }
                }
            } else {
                mouse = "neutral"
                obj_array[tmp_army.x][tmp_army.y] = tmp_army
                render()
            }
            break
        case "industry":
            if(player_turn == 1  && col.style.backgroundColor == "red" && col.innerHTML == "&nbsp;") {
                col.innerText = "I"
                mouse = "neutral"
                obj_array[i][j] = new Industry(i, j, 1)
                getBox1.removeChild(getBox1.childNodes[0])
            }
            if(player_turn == 2 && col.style.backgroundColor == "blue" && col.innerHTML == "&nbsp;") {
                col.innerText = "I"
                mouse = "neutral"
                obj_array[i][j] = new Industry(i, j, 2)
                getBox2.removeChild(getBox2.childNodes[0])
            }
            break
        case "army":
            if(player_turn == 1  && col.style.backgroundColor == "red" && col.innerHTML == "&nbsp;") {
                col.innerText = "A"+player1.people
                mouse = "neutral"
                obj_array[i][j] = new Army(i, j, player1.people, 1)
                player1.people -= player1.people
                getBox1.removeChild(getBox1.childNodes[0])
            }
            if(player_turn == 2 && col.style.backgroundColor == "blue" && col.innerHTML == "&nbsp;") {
                col.innerText = "A"+player2.people
                mouse = "neutral"
                obj_array[i][j] = new Army(i, j, player2.people, 2)
                player2.people -= player2.people
                getBox2.removeChild(getBox2.childNodes[0])
            }
            renderText()  
            break
    }
}

function battle(attacker, defender) {
    let a = attacker.people
    let d = defender.people
    while (a > 0 && d > 0) {
        let rolla = Math.floor(Math.random() * 6)
        let rolld = Math.floor(Math.random() * 6)
        console.log("Roll A: "+rolla+" | Roll D: "+rolld)
        if(rolla > rolld) {
            a--
        } else if(rolla < rolld) {
            d--
        } else {
            a--
            d--
        }
    }
    console.log("Attacker: "+attacker.team+" -> "+a+" | Defender: "+defender.team+"-> "+d)
    if(a > 0) {
        attacker.people = a
        return attacker
    } else if(d > 0) {
        defender.people = d
        return defender
    } else {
        return null
    }
}

function highlight(posx, posy, yourteam) {
    var color
    if(player_turn == 1) {
        color = "#fa8072"
    } else if(player_turn == 2) {
        color = "#4682b4"
    }
    if(posx+1 < size) {
        if(obj_array[posx+1][posy] instanceof Army) {
            if(obj_array[posx+1][posy].team != yourteam) {
                grid.rows[posx+1].cells[posy].style.backgroundColor = color
            }
        } else if(obj_array[posx+1][posy] == null || obj_array[posx+1][posy] instanceof Industry) {
            grid.rows[posx+1].cells[posy].style.backgroundColor = color
        }
    }
    if(posx-1 > -1) {
        if(obj_array[posx-1][posy] instanceof Army) {
            if(obj_array[posx-1][posy].team != yourteam) {
                grid.rows[posx-1].cells[posy].style.backgroundColor = color
            }
        } else if(obj_array[posx-1][posy] == null || obj_array[posx-1][posy] instanceof Industry) {
            grid.rows[posx-1].cells[posy].style.backgroundColor = color
        }
    }
    if(posy+1 < size) {
        if(obj_array[posx][posy+1] instanceof Army) {
            if(obj_array[posx][posy+1].team != yourteam) {
                grid.rows[posx].cells[posy+1].style.backgroundColor = color
            }
        } else if(obj_array[posx][posy+1] == null || obj_array[posx][posy+1] instanceof Industry) {
            grid.rows[posx].cells[posy+1].style.backgroundColor = color
        }    
    }
    if(posy-1 > -1) {
        if(obj_array[posx][posy-1] instanceof Army) {
            if(obj_array[posx][posy-1].team != yourteam) {
                grid.rows[posx].cells[posy-1].style.backgroundColor = color
            }
        } else if(obj_array[posx][posy-1] == null || obj_array[posx][posy-1] instanceof Industry) {
            grid.rows[posx].cells[posy-1].style.backgroundColor = color
        }    
    }
}

function render() {
    let pl_1 = 0
    let pl_2 = 0
    let ind_count1 = 0
    let ind_count2 = 0
    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            if(obj_array[i][j] instanceof Industry) {
                grid.rows[i].cells[j].innerHTML = "I"
                if(obj_array[i][j].team == 1) {
                    ind_count1++
                } else if(obj_array[i][j].team == 2) {
                    ind_count2++
                }
            } else if(obj_array[i][j] instanceof Army) {
                grid.rows[i].cells[j].innerHTML = "A"+obj_array[i][j].people
            } else {
                grid.rows[i].cells[j].innerHTML = "&nbsp"
            }
            if(territory[i][j] == "1") {
                grid.rows[i].cells[j].style.backgroundColor = "red"
                pl_1++
            } else if(territory[i][j] == "2") {
                grid.rows[i].cells[j].style.backgroundColor = "blue"
                pl_2++
            } else {
                grid.rows[i].cells[j].style.backgroundColor = "white"
            }
        }
    }
    player1.territory = pl_1
    player1.industry = ind_count1
    player2.territory = pl_2
    player2.industry = ind_count2
}

function renderText () {
    territoriesTxt1.innerText = "Territories: "+player1.territory
    moneyTxt1.innerText = "Money: $" + player1.money
    peopleTxt1.innerText = "People: " + player1.people
    industryTxt1.innerText = "Industries: " + player1.industry
    territoriesTxt2.innerText = "Territories: "+player2.territory
    moneyTxt2.innerText = "Money: $" + player2.money
    peopleTxt2.innerText = "People: " + player2.people
    industryTxt2.innerText = "Industries: " + player2.industry
}

function make2DArray() {
    let arr = new Array(size)
    for(let i=0; i<arr.length; i++) {
        arr[i] = new Array(size)
    }
    return arr
}

document.addEventListener('click', () => {
    //console.log(mouse)
})

