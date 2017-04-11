class App extends React.Component{
    
    constructor(props){
        super(props);                                 
        
        var deck = [];        
        var suit = 0;
        var val = 2;
        
        var col = [];
        var color = 0;
                
        //Упорядоченная колода
        for(var i = 0; i < 52; i++){
            
            deck[i] = {suit: suit, val: val, img: "k" + (i + 1) + ".png", state: false, color: color < 2?0:1};
            
            suit ++;
            color ++;
                        
            if(suit > 3){
                suit = 0;
                color = 0;
                val ++;
                if(val == 14){
                    val = 1;
                }
            }
        }
        
        var newDeck = [];
        
        //Перемешиваем
        for(var i = 50; i >= 0; i--){
            
            var num = Math.floor(Math.random() * i);
                                    
            newDeck[50 - i] = deck[num];
            deck.splice(num, 1);
        }
        
        newDeck[51] = deck[0];
        
        var count = 1;
        
        // Раскладываем на 7 кучек
        for(var i = 0; i < 7; i++){
            
            col[i] = [];
            for(var j = 0; j < count; j++){
                
                col[i][j] = newDeck[0];
                if(j == count - 1){
                    col[i][j].state = true;
                }
                newDeck.splice(0, 1);
            }
            
            count++;
        }
        
        col[7] = []; //Открытые карты из колоды
                
        //Формируем пустые массивы под 4 дома
        for(var i = 8; i < 12; i++){
            col[i] = [];
        }
        
        this.state = {
                deck: newDeck,                
                col: col,                
                drag: null,                
                dragSrc: null
        };
    }    
    
    render(){
    
        return (
        <div className="desk">
            <table>
                <tbody>
                    <tr>
                        <td><img src = {this.state.deck.length > 0?"img/k0.png":"img/void.png"} className = "active-card" onClick = {(e) => this.deckClick(e)} draggable ="false" /></td>
                        <td><img src = {this.state.col[7].length == 0?"img/void.png":"img/" + this.state.col[7][this.state.col[7].length - 1].img} draggable = {this.state.col[7].length == 0?"false":"true"} className = {this.state.col[7].length == 0?"":"active-card"} x="7" y = {this.state.col[7].length - 1} onDragStart = {(e) => this.cardDragStart(e)} /></td>
                        <td></td>
                        {
                            this.state.col.map(function(el, key){
                                
                                if(key < 8){
                                    return null;
                                }
                                
                                return <td key = {key}>
                                           <img src = {el.length == 0?"img/void.png":"img/" + el[el.length - 1].img} key = {key} x = {key} y = {el.length - 1} 
                                            draggable = {el.length == 0?"false":"true"}
                                            onDragStart={(e) => this.cardDragStart(e)}
                                            onDrop={(e) => this.cardDrop(e)}
                                            onDragEnter = {(e) => this.cardDragEnter(e)}
                                            onDragOver = {(e) => this.cardDragOver(e)} 
                                            />
                                        </td>;
                            }.bind(this))
                        }                        
                    </tr>
                    <tr>
                        { 
                            this.state.col.map(function(el, key){
                                
                                if(key > 6){
                                    return null;
                                }            
                                return <td key={key}>
                                        {el.length > 0?this.renderCard(el, key):this.renderVoid(key)}
                                       </td>
                            }.bind(this))
                        }    
                    </tr>
                </tbody>
            </table>            
         </div>
        );
    }

    renderCard(el, col){
        
        return el.map(function(el, key){
            
                    return <img key = {key} x = {col} y = {key} src = {el.state?"img/" + el.img:"img/k0.png"} 
                        className={(key>0?"card-on-card":"") + (el.state?" active-card":"")} 
                        draggable = {el.state?"true":"false"} 
                        onDragStart={(e) => this.cardDragStart(e)} 
                        onDrop={(e) => this.cardDrop(e)}
                        onDragEnter = {(e) => this.cardDragEnter(e)}
                        onDragOver = {(e) => this.cardDragOver(e)}
                        >
                    </img>;
                }.bind(this))
    }
    
    renderVoid(x){
        
        return <img src = "img/void.png" draggable = "false" x = {x}
            onDrop={(e) => this.cardDrop(e)}
            onDragEnter = {(e) => this.cardDragEnter(e)}
            onDragOver = {(e) => this.cardDragOver(e)}
            >
        </img>;
    }
           
    
    deckClick(e){
        
        var deck = this.state.deck.slice();
        var col = this.state.col.slice();
        
        if(deck.length == 0){
            
            deck = col[7].slice();
            col[7].splice(0, col[7].length);            
        }else{
            
            col[7][col[7].length] = deck[0];
            deck.splice(0, 1);
        }
        
        
        
        this.setState({
            deck: deck,
            col: col
        });
    }
    
    cardDragStart(ev){
        
        ev.dataTransfer.effectAllowed="move";
                
        var dragSrc = Number(ev.target.getAttribute("x"));
        var num = Number(ev.target.getAttribute("y")); 
        var drag = [];        
        
        for(var i = num; i < this.state.col[dragSrc].length; i++){
            
            drag[i - num] = this.state.col[dragSrc][i];
            drag[i - num].state = true;
        }
                        
        this.setState({drag: drag, dragSrc: dragSrc});
        
        return true;
    }
    
    cardDrop(e){
        
        //console.log("drop!");
        var col = this.state.col.slice(); 
        var colToNum = Number(e.target.getAttribute("x"));
        var colTo = col[colToNum];
        var colFrom = col[this.state.dragSrc]       
        var drag = this.state.drag.slice();
        
        if(colTo == colFrom){
            return;
        }
        
        //На пустое поле только короля
        if(colToNum < 7 && colTo.length == 0 && drag[0].val != 13){
            return;
        }
        
        //В пустой дом только туза
        if(colToNum > 6 && ((colTo.length == 0 && drag[0].val != 1) || drag.length > 1)){
            return;
        }
        
        if(colToNum < 7 && colTo.length > 0 && ((colTo[colTo.length - 1].val - drag[0].val) != 1 || colTo[colTo.length - 1].color == drag[0].color)){
            
            return;
        }
        
        if(colToNum > 6 && colTo.length > 0 && (colTo[colTo.length - 1].val - drag[0].val != 1 || colTo[colTo.length - 1].suit != drag[0].suit)){
            return;
        }
        
        for(var i = 0; i < drag.length; i++){
            colTo[colTo.length] = drag[i];
        }
        
        colFrom.splice(colFrom.length - drag.length, drag.length);
        
        if(colFrom.length > 0){
            colFrom[colFrom.length - 1].state = true;
        }
        
        this.setState({col: col});
        return true;
    }
    
    houseCardDrop(e){
        
    }
    
    cardDragEnter(ev) {
        ev.preventDefault();
        return true;
    }
    
    cardDragOver(ev) {
        
        ev.preventDefault();
        return true;
    }
}

ReactDOM.render(
        <App />,
        document.getElementById("app")
    );