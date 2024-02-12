const cl = console.log;

const card = document.getElementById("card-post")
const titleControl = document.getElementById("title")
const postform = document.getElementById("postForm")
const bodyControl = document.getElementById("body")
const userIdControl = document.getElementById("userId")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")


let baseUrl = `https://jsonplaceholder.typicode.com`

let postUrl = `${baseUrl}/posts`

let postArr = []
// config 




const getHandle = () => {
    let xhr = new XMLHttpRequest();

     xhr.open("GET", postUrl)
     
     xhr.send()
     
     xhr.onload = function () {
         // cl(xhr.response)
         if(xhr.status === 200){
             postArr = JSON.parse(xhr.response)
             // cl(data)
             templating(postArr)
         }else{
             alert(`something went wrong`)
         }
    }
}
getHandle()

const createCardPost = (ele) => {
    
}

const createPost = (ele) => {
    let xhr1 = new XMLHttpRequest()

    xhr1.open("POST", postUrl, true)

    xhr1.send(JSON.stringify(ele)) 

    xhr1.onload = function () {
        if(xhr1.status === 200 || xhr1.status === 201){
            ele.id = JSON.parse(xhr1.response).id
            postArr.push(ele)
            templating(postArr)
        }
    }
}


const onSubmitPost = (eve) => {
    eve.preventDefault()
    let postObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(postObj)

    createPost(postObj)
    postform.reset()

    
    Swal.fire({
      title: "Added Successfully!",
      icon: "success"
    });
       
}

const onUpdatePost = () => {
    let getUpdateObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(getUpdateObj)

   let updateId = localStorage.getItem("Id")
   cl(updateId)

    let updateUrl = `${postUrl}/${updateId}`

    cl(updateUrl)

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", updateUrl, true)

    xhr.send(JSON.stringify(getUpdateObj))

    xhr.onload = function () {
        if(xhr.status === 200){
           let getIndexOf = postArr.findIndex(post => {
               return post.id == updateId
           })
           
           postArr[getIndexOf].title = getUpdateObj.title,
           postArr[getIndexOf].body = getUpdateObj.body,
           postArr[getIndexOf].userId = getUpdateObj.userId

           updateBtn.classList.add("d-none")
           addBtn.classList.remove("d-none")

           templating(postArr)
           postform.reset()

           Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });
          
        }else{
            cl(`something went wrong`)
        }  
    }
}

postform.addEventListener("submit", onSubmitPost)
updateBtn.addEventListener("click", onUpdatePost)


const onClickEdit = (eve) => {
    let getId = eve.closest(".col-md-6").id
    cl(getId)

    localStorage.setItem("Id", getId)
    
    let getUrl = `${postUrl}/${getId}`
    // cl()

    let xhr = new XMLHttpRequest();

    xhr.open("GET", getUrl, true) // 1} method name 2} url 3} ascronous behaviour handler

    xhr.send()

    xhr.onload = function () {
        cl(xhr.response)
        if(xhr.status === 200){
            let newObj = JSON.parse(xhr.response)

            titleControl.value = newObj.title,
            bodyControl.value = newObj.body,
            userIdControl.value = newObj.userId

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")           
        }
    }
}

const onDeleteClick = eve => {
    // cl(eve)
    let deleteId = eve.closest(".col-md-6").id

    let deleteUrl = `${postUrl}/${deleteId}`

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", deleteUrl)

    xhr.send()

    xhr.onload = function (){
        if(xhr.status === 200){

                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                        timer : 1500
                      });
                      document.getElementById(deleteId).remove();
                    }
                  });

    }
}
}

const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `<div class="col-md-6 offset-md-3" id="${post.id}">
                    <div class="card mb-5">
                      <div class="card-header">
                          <h2>${post.title}</h2>
                      </div>
                      <div class="card-body">
                          <p>${post.body}</p>
                      </div>
                      <div class="card-footer d-flex justify-content-between">
                          <Button class="btn btn-outline-primary" onClick="onClickEdit(this)">Edit</Button>
                          <Button class="btn btn-outline-danger" onClick="onDeleteClick(this)">Delete</Button>
                      </div>
                    </div>
                   </div>
        
                     `
    });
    card.innerHTML = result;
}

