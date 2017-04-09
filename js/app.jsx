class App extends React.Component{
    
    constructor(props){
        super(props);                                 
        
        var deck = [];        
        var suit = 0;
        var val = 2;
        
        var col = [];
                
        //Упорядоченная колода
        for(var i = 0; i < 52; i++){
            
            deck[i] = {suit: suit, val: val, img: "k" + (i + 1) + ".png", state: false};
            
            suit ++;
                        
            if(suit > 3){
                suit = 0;
                val ++;
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
        
        this.state = {
                deck: newDeck,
                col: col
        };
    }    
    
    render(){
    
        return (
        <div className="center">            
            { 
                this.state.col.map(function(el, key){
                                
                    return <div className="inline" key={key}>
                            {this.renderCard(el)}
                           </div>
                }.bind(this))
            }
         </div>
        );
    }

    renderCard(el){
        
        return el.map(function(el, key){
            
                    return <img key = {key} src = {el.state?"img/" + el.img:"img/k0.png"} className={key>0?"top":""} ></img>;
                })
    }
    
    cardClick(e, key){
        
        var deck = this.state.deck.slice();
        
        deck[key].state = !deck[key].state;
        
        this.setState({deck: deck});
    }
}

ReactDOM.render(
        <App />,
        document.getElementById("app")
    );