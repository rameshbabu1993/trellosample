class Card extends HTMLElement {

    cardRoot

    constructor() {
      super();

      this.cardRoot = this.attachShadow({mode: 'open'});
        
      // card style
      const style = document.createElement('style');
      style.textContent = `
        .card{
            background-color: #CCDCE6;
            border-radius: 4px;
            font-size: .9rem;
            margin-bottom: 8px;
            min-height: 33px;
            position: relative;
            overflow: hidden;
        }

        .card .content{
            background-color: #fff;
            padding: 6px 8px;
            min-height: 33px;
        }

        .card .content h4{
            letter-spacing: .5px;
            margin: 5px;
            max-width: 74%;
            word-break: break-word;
            display:inline-block;
        }

        .card .content p{
            margin: 5px;
            word-break: break-word;
        }

        .hide {
            display: none !important ;
        }
        
        .flt-rg{
          float: right;
          padding: 5px;
        }
        `
  
      this.cardRoot.appendChild(style);
    }
  
    connectedCallback(){  
        
      // card root
      const divElem = document.createElement("div");
      divElem.id = this.getAttribute("cardId");
      divElem.setAttribute("draggable", true);
      divElem.addEventListener("ondragstart", this.dragStart);
      //divElem.setAttribute("ondragstart", (e) => {this.dragStart(e)});
      divElem.className = "card"

      const divContentElem = document.createElement("div");
      divContentElem.className = "content"
      divElem.appendChild(divContentElem);
  
      // card header   
      const headerElm = document.createElement("header");
      divContentElem.appendChild(headerElm);
  
      // card title   
      const titleElm = document.createElement("h4");
      titleElm.innerHTML = this.getAttribute('cardTitle');
      titleElm.addEventListener("click", this.toggleClass);
      headerElm.appendChild(titleElm);

      const deleteElm = document.createElement("span")
      deleteElm.className = "flt-rg";
      deleteElm.innerHTML = "delete";
      deleteElm.addEventListener("click", (e) => {this.addModal('delete')});
      headerElm.appendChild(deleteElm);

      const editElm = document.createElement("span")
      editElm.className = "flt-rg";
      editElm.innerHTML = "edit";
      editElm.addEventListener("click", (e) => {this.addModal('edit')});
      headerElm.appendChild(editElm);
  
      // card description
      const descriptionElm = document.createElement("p");
      descriptionElm.className = "hide";
      descriptionElm.id = `${this.getAttribute('cardId')}_content`;
      descriptionElm.innerHTML = this.getAttribute('cardDescription') != "" ? this.getAttribute('cardDescription') : "No description Available.";
      divContentElem.appendChild(descriptionElm);

      this.cardRoot.appendChild(divElem);

      this.cardRoot.addEventListener("card_edit",(e) => {
        this.cardRoot.getElementById("div-mod").remove();
        this.editCard(e.detail);
      })

      this.cardRoot.addEventListener("card_delete",(e) => {
        this.cardRoot.getElementById("div-mod").remove();
        this.deleteCard(e.detail);
      })

      this.cardRoot.addEventListener("edit_close",() => {
        this.cardRoot.getElementById("div-mod").remove();
      });

      this.cardRoot.addEventListener("delete_close",() => {
        this.cardRoot.getElementById("div-mod").remove();
      });
    }
    
    // hide show description
    toggleClass = () =>{
        this.cardRoot.getElementById(`${this.getAttribute('cardId')}_content`).classList.toggle("hide");
    }

    dragStart = (e) => {
      console.log("test");
      e.dataTransfer.setData('text/plain', this.getAttribute("cardId"));
    }

    addModal = (type) => {
      let divElm = document.createElement("div");
      divElm.id = "div-mod";

      let mod = document.createElement("modal-container");
      this.setElmAttribute(mod, "modal-title", type == 'edit'? 'Edit card' : 'delete card');
      this.setElmAttribute(mod, "cardId", this.getAttribute("cardId"));
      if(type == 'edit'){
        this.setElmAttribute(mod, "title", this.getAttribute('cardTitle'));
        this.setElmAttribute(mod, "columnId", this.getAttribute('columnId'));
        this.setElmAttribute(mod, "description", this.getAttribute("cardDescription"));
        this.setElmAttribute(mod, "columnData", this.getAttribute("colData"));
      }else{
        this.setElmAttribute(mod, "deleteMsg", "Are you sure you to delete card?");
      }
      this.setElmAttribute(mod,"type","card");
      this.setElmAttribute(mod,"action",type);

      divElm.appendChild(mod);

      this.cardRoot.appendChild(divElm);
    }
    

    editCard = async(postData)=>{
      try{
        let data = await fetch(`http://localhost:3000/api/editcard/${postData.id}`,{
                      method: 'put',
                      headers:{'content-type': 'application/json'},
                      body: JSON.stringify(postData) 
                    });
        let jsonData = await data.json(); 
        this.dispatchEvent(new CustomEvent('updateDom', {bubbles: true, composed: true, detail: jsonData}))
      }catch(e){
        console.log(e);
      }
    }

    deleteCard = async(postData)=>{
      try{
        let data = await fetch(`http://localhost:3000/api/deletecard/${postData.id}`,{
                      method: 'delete',
                      headers:{'content-type': 'application/json'}
                    });
        let jsonData = await data.json(); 
        this.dispatchEvent(new CustomEvent('updateDom', {bubbles: true, composed: true, detail: jsonData}))
      }catch(e){
        console.log(e);
      }
    }

    setElmAttribute = (source, attribute, data) =>{
      source.setAttribute(attribute, data);
    }
  }
  
  customElements.define("card-container", Card);