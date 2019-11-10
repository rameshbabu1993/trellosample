class Column extends HTMLElement {

  columnRoot;

  constructor() {
    super();

    this.columnRoot = this.attachShadow({mode: 'open'});

    // column Style
    const style = document.createElement('style');
    style.textContent = `

    .column h5{
      max-width: 74%;
      color: #fff;
    }

    .column h5{
        letter-spacing: .5px;
        margin: 10px 5px;
        word-break: break-word;
        display: inline-block;
    }
    
    .flt-rg{
      float: right;
      padding: 5px;
    }
    `;

    this.columnRoot.appendChild(style);
  }

  connectedCallback(){

    // column root
    const divElem = document.createElement("div");
    divElem.id = this.getAttribute("columnId");
    divElem.setAttribute("ondragover", this.dragOver);
    divElem.setAttribute("ondrop", this.onDrop);
    divElem.className = "column"

    // column header
    const headerElm = document.createElement("header");
    divElem.appendChild(headerElm);

    // column title
    const titleElm = document.createElement("h5");
    titleElm.innerHTML = this.getAttribute('title');
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

    this.columnRoot.appendChild(divElem);

    // build cards
    let cardData = JSON.parse(this.getAttribute("cardinfo"));
    this.buildCard(cardData, divElem);

    this.columnRoot.addEventListener("column_edit",(e) => {
      this.columnRoot.getElementById("div-mod").remove();
      this.editColumn(e.detail);
    })

    this.columnRoot.addEventListener("column_delete",(e) => {
      this.columnRoot.getElementById("div-mod").remove();
      this.deleteColumn(e.detail);
    })

    this.columnRoot.addEventListener("edit_close",() => {
      this.columnRoot.getElementById("div-mod").remove();
    });

    this.columnRoot.addEventListener("delete_close",() => {
      this.columnRoot.getElementById("div-mod").remove();
    });
  }

  buildCard = (data, root) =>{
    data.map((cardData) => {
      let cardElm = document.createElement("card-container");
      this.setElmAttribute(cardElm, "cardId", cardData.id);
      this.setElmAttribute(cardElm, "cardTitle", cardData.title);
      this.setElmAttribute(cardElm, "columnId", cardData.columnId);
      this.setElmAttribute(cardElm, "colData", this.getAttribute('colData'));
      this.setElmAttribute(cardElm, "cardDescription", cardData.description);
      root.appendChild(cardElm);
    })
  }

  dragOver = (e)=>{
    console.log("test1");
    e.preventDefault();
  }

  onDrop = (e) =>{
    console.log("test1231");
    console.log(e.dataTransfer.getData('text'));
  }

  addModal = (type) => {
    let divElm = document.createElement("div");
    divElm.id = "div-mod";

    let mod = document.createElement("modal-container");
    this.setElmAttribute(mod, "modal-title", type == 'edit'? 'Edit Column' : 'Delete Column');
    this.setElmAttribute(mod, "columnId", this.getAttribute('columnId'));
    if(type == 'edit'){
      this.setElmAttribute(mod, "title", this.getAttribute('title'));
    }else{
      this.setElmAttribute(mod, "deleteMsg", "Deleting column will delete cards in it. Are you sure you to delete column?");
    }
    this.setElmAttribute(mod,"type","column");
    this.setElmAttribute(mod,"action",type);

    divElm.appendChild(mod);

    this.columnRoot.appendChild(divElm);
  }
  

  editColumn = async(postData)=>{
    try{
      let data = await fetch(`http://localhost:3000/api/editcolumn/${postData.id}`,{
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

  deleteColumn = async(postData)=>{
    try{
      let data = await fetch(`http://localhost:3000/api/deletecolumn/${postData.id}`,{
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

customElements.define("column-container", Column);