class App extends React.Component{
    
    constructor(props){
        super(props);                                 
        
        var deck = [];        
        var suit = 0;
        var val = 2;
        for(var i = 0; i < 52; i++){
            
            deck[i] = {suit: suit, val: val, img: "k" + (i + 1) + ".png", state: false};
            
            suit ++;
                        
            if(suit > 3){
                suit = 0;
                val ++;
            }
        }
        
        var newDeck = [];
        
        for(var i = 50; i >= 0; i--){
            
            var num = Math.floor(Math.random() * i);
                                    
            newDeck[50 - i] = deck[num];
            deck.splice(num, 1);
        }
        
        newDeck[51] = deck[0];
        
        this.state = {
                deck: newDeck
        };
    }    
    
    render(){  
        
        var comp = this;
    
        return (
        <div>
            {this.state.deck.map(function(el, key){
                return <img className = "card" key={key} src={el.state==true?"img/"+ el.img:"img/k0.png"} onClick={(e)=>comp.cardClick(e, key)} />;
                })
            }            
        </div>
        );
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