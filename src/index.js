// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quotesURL = 'http://localhost:3000/quotes'
const likesURL = 'http://localhost:3000/likes'
const embededURL = 'http://localhost:3000/quotes?_embed=likes'
let editQuote = false

document.addEventListener("DOMContentLoaded",()=>{
    const newQuote = document.querySelector('#new-quote-form')

    fetch(embededURL)
    .then(res => res.json())
    .then(quotesData => {
        quotesData.forEach(quote=>{
            createQuote(quote)
        })
    })

    const createQuote = (quote) =>{
        const ul = document.querySelector('#quote-list')

        const li = document.createElement('li')
        li.className = 'quote-card'

        const bQ = document.createElement('blockquote')
        bQ.className = 'blockquote'

        const p = document.createElement('p')
        p.className = 'mb-0'
        p.innerText = quote.quote

        const footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerText = quote.author
        
        const br = document.createElement('br')

        const likeBtn = document.createElement('button')
        likeBtn.className = 'btn-success'
        likeBtn.innerText = `Likes: `

        const span = document.createElement('span')
        span.innerText = quote.likes.length

        addLike(quote,span,likeBtn)

        const dltBtn = document.createElement('button')
        dltBtn.className = 'btn-danger'
        dltBtn.innerText = 'Delete'

        deleteQuote(dltBtn, quote,li)

        const editBtn = document.createElement('button')
        editBtn.className = 'btn-edit'
        editBtn.innerText = 'Edit'

        editBtn.addEventListener('click', ()=>{
            editQuote = !editQuote
        })

        editQuote()

        likeBtn.append(span)
        bQ.append(p,footer,br,likeBtn,dltBtn,editBtn)
        li.append(bQ)
        ul.append(li)
    }

    newQuote.addEventListener("submit", () => {
        event.preventDefault()

        let quote = event.target[0].value
        let author = event.target[1].value

        fetch(quotesURL,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'quote': quote,
                'author': author
            })
        })
        .then(res=>res.json())
        .then(newQuote=>{
            newQuote.likes =[]
            createQuote(newQuote)
        })
    })

    const deleteQuote = (dltBtn, quote,li)=>{
        dltBtn.addEventListener("click",() => {
            fetch(`http://localhost:3000/quotes/${quote.id}`,{
                method:"DELETE"
            })
            li.remove()
        })
    }

    const addLike = (quote,span,likeBtn) =>{
        likeBtn.addEventListener("click", ()=>{
            let d = new Date()
            let t = d.getTime()
            fetch(likesURL, {
                method: "POST",
                headers:{
                    "Content-Type": 'application/json'
                },
                body:JSON.stringify({
                    "quoteId": quote.id,
                    "createdAt": t
                })
            })
            .then(res => res.json())
            .then(updateLikes =>{ 
                span.innerText = ++quote.likes.length
            })
        })
    }

    const editQuote = () =>{

    }
})