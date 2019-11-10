customElements.define('root-component',
  class extends HTMLElement {

    shadowRoot;
    jsonData;

    constructor() {
      super();

        this.shadowRoot = this.attachShadow({mode: 'open'});
      
        const style = document.createElement('style');
        style.textContent = `.root_container{
            width: 100%;
            height: 100%;
            padding: 1rem;
        }
        
        .parent{
          display: flex;
        }

        .btn{
          padding: 5px;
          margin: 5px;
        }

        .col-div{
            margin: 5px 10px;
            min-width: 25%;
            max-width: 25%;
            background: linear-gradient(#3EB9DE, #3A80DE);
            background-size: cover;
            background-position: center;
            border-radius: 1rem;
            box-shadow: 0 10px 20px rgba(74,115,159,0.29);
            cursor: default;
            position: relative;
            min-height: 100px;
            padding: 18px;
            display: inline-block;
        }

        `;
        this.shadowRoot.appendChild(style);
    }

    async connectedCallback(){
        let data = await fetch('http://localhost:3000/api');
        this.jsonData = await data.json();

        // root container
        this.divElm = document.createElement("div");
        this.divElm.id = "root";
        this.divElm.className = "root_container";
        this.shadowRoot.appendChild(this.divElm);

        // header
        const headerElm = document.createElement("header");
        this.divElm.appendChild(headerElm);

        const colAddBtn = document.createElement("button");
        colAddBtn.id = "colAdd";
        colAddBtn.type = "button"
        colAddBtn.className = "btn";
        colAddBtn.innerHTML = "Add Column";
        colAddBtn.addEventListener("click", (e) => {this.addModal("column", null)});
        headerElm.appendChild(colAddBtn);

        const cardAddBtn = document.createElement("button");
        cardAddBtn.id = "cardAdd";
        cardAddBtn.type = "button";
        cardAddBtn.className = "btn";
        cardAddBtn.innerHTML = "Add Card";
        cardAddBtn.addEventListener("click", (e) => {this.addModal("card", this.jsonData.data.columns)});
        headerElm.appendChild(cardAddBtn);

        const hr = document.createElement("hr");
        this.divElm.appendChild(hr);

        // build Column
        this.buildColumn(this.jsonData.data, this.divElm);

        // consume modal close event
        this.shadowRoot.addEventListener("add_close",(e)=>{
          this.shadowRoot.getElementById("div-mod").remove();
        })

        // consume card add event
        this.shadowRoot.addEventListener("card_add",(e)=>{
          this.shadowRoot.getElementById("div-mod").remove();
          this.createCard(e.detail);
        })

        // consume update event
        this.shadowRoot.addEventListener("updateDom", (e)=>{
          console.log(e.detail);
          this.updateDom(e.detail);
        })
        
        // consume edit column
        this.shadowRoot.addEventListener("column_edit",(e)=>{
          this.editColumn(e.detail);
        })

        // consume column add event
        this.shadowRoot.addEventListener("column_add",(e)=>{
          this.shadowRoot.getElementById("div-mod").remove();
          this.createColumn(e.detail);
        })
    }

    buildColumn = (data, root) =>{
      let container = document.createElement("div");
      container.className = "parent";
      container.id = "col-container";

      data.columns.map((colData) => {
        let divElm = document.createElement("div");
        divElm.id = `col-${colData.id}`;
        divElm.className = "col-div"; 

        let cardData = this.getCardData(data.cards,colData.id);
        let columnElm = document.createElement("column-container");
        this.setElmAttribute(columnElm, "columnId", colData.id);
        this.setElmAttribute(columnElm, "title", colData.title);
        this.setElmAttribute(columnElm, "coldata", JSON.stringify(data.columns));
        this.setElmAttribute(columnElm, "cardInfo", JSON.stringify(cardData));
        
        divElm.appendChild(columnElm)

        container.appendChild(divElm);
      });
      
      root.appendChild(container);
    }

    addModal = (type, colData, data = null) => {
      if(type == "card" && colData.length == 0){
        alert("Please create a column");
        return;
      }
      let divElm = document.createElement("div");
      divElm.id = "div-mod";

      let mod = document.createElement("modal-container");
      this.setElmAttribute(mod, "modal-title", (type == 'card') ? "Add Card" : "Add Column");
      this.setElmAttribute(mod, "title", (data && data.title) ? data.title: "");
      if(type == 'card'){
        this.setElmAttribute(mod, "description", (data && data.description != null) ? data.description: "");
        this.setElmAttribute(mod, "columnData", JSON.stringify(colData));
      }
      this.setElmAttribute(mod,"type",type);
      this.setElmAttribute(mod,"action","add");

      divElm.appendChild(mod);

      this.shadowRoot.appendChild(divElm);
    }

    getCardData = (data,columnId)=>{
        return data.filter((cardData)=>{
          return (cardData.columnId == columnId) ? true : false;
        })
    }

    setElmAttribute = (source, attribute, data) =>{
      source.setAttribute(attribute, data);
    }

    createCard = async(postData)=>{
      try{
        console.log(postData);
        let data = await fetch('http://localhost:3000/api/addcard',{
                      method: 'post',
                      headers:{'content-type': 'application/json'},
                      body: JSON.stringify(postData) 
                    });
        this.jsonData = await data.json(); 
        this.shadowRoot.getElementById("col-container").remove();
        this.buildColumn(this.jsonData.data,this.divElm);
      }catch(e){
        console.log(e);
      }
    }

    createColumn = async(postData)=>{
      try{
        console.log(postData);
        let data = await fetch('http://localhost:3000/api/addcolumn',{
                      method: 'post',
                      headers:{'content-type': 'application/json'},
                      body: JSON.stringify(postData) 
                    });
        this.jsonData = await data.json(); 
        this.shadowRoot.getElementById("col-container").remove();
        this.buildColumn(this.jsonData.data,this.divElm);
      }catch(e){
        console.log(e);
      }
    }

    updateDom = async(data)=>{
      try{
        this.shadowRoot.getElementById("col-container").remove();
        console.log(data);
        this.jsonData = data;
        this.buildColumn(data.data,this.divElm);
      }catch(e){
        console.log(e);
      }
    }
  }
);
