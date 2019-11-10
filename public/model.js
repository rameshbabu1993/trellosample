class Modal extends HTMLElement{
    
  modalRoot;

  constructor() {
    super();

    this.modalRoot = this.attachShadow({mode: 'open'});

    // column Style
    const style = document.createElement('style');
    style.textContent = `
    .modal {
        display: block;
        position: fixed;
        z-index: 1; 
        padding-top: 100px; 
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%;
        overflow: auto; 
        background-color: rgb(0,0,0); 
        background-color: rgba(0,0,0,0.4);
      }
      
      /* Modal Content */
      .modal-content {
        position: relative;
        background-color: #fefefe;
        margin: auto;
        padding: 0;
        border: 1px solid #888;
        width: 80%;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
        -webkit-animation-name: animatetop;
        -webkit-animation-duration: 0.4s;
        animation-name: animatetop;
        animation-duration: 0.4s
      }
      
      .modal-content p{
          padding: 5px;
      }

      /* Add Animation */
      @-webkit-keyframes animatetop {
        from {top:-300px; opacity:0} 
        to {top:0; opacity:1}
      }
      
      @keyframes animatetop {
        from {top:-300px; opacity:0}
        to {top:0; opacity:1}
      }

      h3{
          display: inline-block;
      }
      
      /* The Close Button */
      .close {
        color: white;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }
      
      .close:hover,
      .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
      
      .modal-header {
        padding: 2px 16px;
        background-color: #5cb85c;
        color: white;
      }

      .form-label{
          margin: 1%
      }

      .form-control{
          margin: 0 1%;
      }
      
      .modal-body {padding: 2px 16px;}
      
      .modal-footer {
        padding: 2px 16px;
        border-top: 1px solid #000;
      }
      
      .hide{
          display: none;
      }

      .btn{
        padding: 5px;
        margin: 5px;
      }
      `;

    this.modalRoot.appendChild(style);
  }

  connectedCallback(){

    // modal root
    const divElem = document.createElement("div");
    divElem.id = "modal";
    divElem.className = "modal"

    // modal content
    const mdlContentElm = document.createElement("div");
    mdlContentElm.className = "modal-content";
    divElem.appendChild(mdlContentElm);

    // modal header
    const mdlHeaderElm = document.createElement("div");
    mdlHeaderElm.className = "modal-header";
    mdlContentElm.appendChild(mdlHeaderElm);

    // modal title
    const mdltitleElm = document.createElement("h3");
    mdltitleElm.innerHTML = this.getAttribute("modal-title");
    mdlHeaderElm.appendChild(mdltitleElm);

    // close btn
    const clsBtn = document.createElement("span");
    clsBtn.innerHTML = "&times;";
    clsBtn.className = "close"
    clsBtn.addEventListener("click", this.toggleClass);
    mdlHeaderElm.appendChild(clsBtn);

    // modal body
    const mdlBodyElm = document.createElement("div");
    mdlBodyElm.className = "modal-body";
    mdlContentElm.appendChild(mdlHeaderElm);

    if(this.getAttribute("title") != null){
        this.generateInputElement(mdlContentElm, "title", this.getAttribute("title"));
    }

    if(this.getAttribute("deleteMsg") != null){
        let msg = document.createElement("p");
        msg.innerHTML = this.getAttribute('deleteMsg');
        mdlContentElm.appendChild(msg);
    }

    if(this.getAttribute("description") != null){
        this.generateInputElement(mdlContentElm, "description", this.getAttribute("description"));
    }

    if(this.getAttribute("columnData") != null){
        this.generateColumnElement(mdlContentElm, JSON.parse(this.getAttribute("columnData")), this.getAttribute("columnId") != null ? this.getAttribute("columnId") : "" )
    }

    // modal footer
    const mdlFooterElm = document.createElement("div");
    mdlFooterElm.className = "modal-footer";
    mdlContentElm.appendChild(mdlFooterElm);

    const addBtn = document.createElement("button");
    addBtn.id = "save";
    addBtn.type = "button"
    addBtn.className = "btn";
    addBtn.innerHTML = this.getAttribute('action') == 'add'? "Save" : this.getAttribute("action") == 'edit' ? "Update": "Delete";
    addBtn.addEventListener("click", this.generateEvent);
    mdlFooterElm.appendChild(addBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancel";
    cancelBtn.type = "button"
    cancelBtn.className = "btn";
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.addEventListener("click", this.toggleClass);
    mdlFooterElm.appendChild(cancelBtn);

    this.modalRoot.appendChild(divElem);
  }

  generateInputElement(source, label, data){
    const divElm = document.createElement("div");
    divElm.className = "form-label"
    
    const labelElm = document.createElement("span");
    labelElm.innerHTML = label;
    divElm.appendChild(labelElm);

    const inputElm = document.createElement("input");
    inputElm.id = label;
    inputElm.className = "form-control";
    inputElm.value = data;
    labelElm.appendChild(inputElm);

    source.appendChild(divElm);
  }

  generateColumnElement(source, colData, columnId){
    const divElm = document.createElement("div");
    divElm.className = "form-label";
    
    const labelElm = document.createElement("label");
    labelElm.innerHTML = "Select a column";
    divElm.appendChild(labelElm);

    const radGrp = document.createElement("div");

    colData.map((data)=>{

        const radioElm = document.createElement("input");
        radioElm.type = "radio";
        radioElm.id = `${data.id}_radio`;
        radioElm.value = data.id;
        radioElm.name = "column";
        if(data.id == columnId){
            radioElm.checked = true;
        }
        radGrp.appendChild(radioElm);

        const span = document.createElement("span");
        span.innerHTML = data.title;
        span.for = `${data.id}_radio`;
        radGrp.appendChild(span);
    })

    divElm.appendChild(radGrp);

    source.appendChild(divElm);
  }

  // hide modal
  toggleClass = () =>{
    this.modalRoot.getElementById(`modal`).classList.toggle("hide");
    this.dispatchEvent(new CustomEvent(`${this.getAttribute("action")}_close`, {bubbles: true, cancelable: false}));
  }

  generateEvent = () => {
    let data = {};
    if(this.getAttribute("action") != 'delete' && this.validate()){
        if(this.getAttribute("type") == 'card'){
            if(this.getAttribute("cardId") && this.getAttribute("cardId") != null){
                data.id = this.getAttribute("cardId");
            }
            data.title = this.modalRoot.getElementById("title").value;
            data.description = this.modalRoot.getElementById("description").value;
            data.columnId = this.modalRoot.querySelector('input[name="column"]:checked').value;
        } else if(this.getAttribute("type") == 'column'){
            if(this.getAttribute("columnId") && this.getAttribute("columnId") != null){
                data.id = this.getAttribute("columnId");
            }
            data.title = this.modalRoot.getElementById("title").value;
        }
        this.dispatchEvent(new CustomEvent(`${this.getAttribute("type")}_${this.getAttribute("action")}`, {bubbles: true, cancelable: false, detail: data}));
    }else if(this.getAttribute("action") == 'delete'){
        if(this.getAttribute("type") == 'card'){
            if(this.getAttribute("cardId") && this.getAttribute("cardId") != null){
                data.id = this.getAttribute("cardId");
            }
        }else if(this.getAttribute("type") == 'column'){
            if(this.getAttribute("columnId") && this.getAttribute("columnId") != null){
                data.id = this.getAttribute("columnId");
            }
        }
        this.dispatchEvent(new CustomEvent(`${this.getAttribute("type")}_${this.getAttribute("action")}`, {bubbles: true, cancelable: false, detail: data}));
    }
  }

  validate =()=>{
    if(this.modalRoot.getElementById("title").value == ""){
        alert("Please enter a title");
        return false;
    }
    if(this.getAttribute("type") == 'card'){
        if(this.modalRoot.querySelector('input[name="column"]:checked') == null){
            alert("Please select a column");
            return false;
        }
    }
    return true;
  }
}

customElements.define('modal-container', Modal);