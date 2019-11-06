// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded',()=>{
    console.log('document be loaded')
    const URLQuotesLikes = 'http://localhost:3000/quotes?_embed=likes'
    const URLQuotes = 'http://localhost:3000/quotes'
    const URLLikes = 'http://localhost:3000/likes'
//     Populate page with quotes with a `GET` request to
//   `http://localhost:3000/quotes?_embed=likes`. The query string in this URL tells 
//   `json-server` to include the likes for a quote in the JSON of the response. You
//   should not use this query string when creating or deleting a quote.
    const quotesContainer = document.querySelector('#quote-list')
    const newQuote = document.querySelector('#new-quote-form')

    fetch(URLQuotesLikes)
    .then(res => res.json())
    .then(data => {
        data.forEach(quote => {
            renderQuote(quote);
        })
    })

    function renderQuote(quote){
        let hidden = true
        // HTML elements, dynamic data, append to page

        // console.log('this be my argument',quote)

    //     <li class='quote-card'>
    //     <blockquote class="blockquote">
    //       <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    //       <footer class="blockquote-footer">Someone famous</footer>
    //       <br>
    //       <button class='btn-success'>Likes: <span>0</span></button>
    //       <button class='btn-danger'>Delete</button>
    //     </blockquote>
    //   </li>

        const li = document.createElement('li')
        li.className = 'quote-card'
        const bq = document.createElement('blockquote')
        bq.className = 'blockquote'
        const p = document.createElement('p')
        p.className = 'mb-0'
        p.innerText = quote.quote
        const footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerText = quote.author
        const br = document.createElement('br')
        const likeButton = document.createElement('button')

        likeButton.className = 'btn-success'
        likeButton.innerText = 'Likes: '

        likeButton.addEventListener('click',()=>{
            let d = new Date()
            let t = d.getTime()
            fetch(URLLikes, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "quoteId": quote.id,
                    "createdAt": t
                })
            })
            .then(res => res.json())
            .then(data=> {
                span.innerText = ++quote.likes.length
            })
        })


        const span =  document.createElement('span')
        span.innerText = quote.likes.length
        
        // if(quote.likes){
            // span.innerText = quote.likes.length
            // }
            // else{
                //     span.innerText = '0'
                // }
                
                likeButton.append(span)
                
                const deleteButton = document.createElement('button')
                deleteButton.innerText = 'Delete'
                deleteButton.className = 'btn-danger'
                deleteButton.innerText = 'Delete'


                const editButton = document.createElement('button')
                editButton.className = "btn-warning"
                editButton.innerText = 'Edit'


                // this is my edit form
                const form = document.createElement('form')
                form.style.display = 'none'
                const editQuote = document.createElement('input')
                const editAuthor = document.createElement('input')
                const editSubmit = document.createElement('button')
                editSubmit.type = 'submit'
                editSubmit.innerText = 'Submit Changes'
                editQuote.placeholder = quote.quote
                // editQuote.className = 'mb-0'
                editAuthor.placeholder = quote.author
                const br2 = document.createElement('br')
                // editAuthor.className = 'mb-0'
                form.append(editQuote,br2, editAuthor, editSubmit)
                form.style.width = "100%"
                editQuote.style.width = "100%"
                // li.append(form)

                // clicking edit button
                editButton.addEventListener('click', ()=>{
                    hidden = !hidden
                    if(hidden){
                        form.style.display = 'none'
                    }
                    else{
                        form.style.display = 'block'
                        
                    }
                   
                    console.log('edit has been clicked')

                    // console.log(editQuote, editAuthor);

                    form.addEventListener('submit', (e)=>{
                        e.preventDefault()
                        let eQ = e.target[0].value
                        let eA = e.target[1].value

                        fetch(`${URLQuotes}/${quote.id}`, {
                            method: 'PATCH',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                quote: eQ,
                                author: eA
                            })
                        })
                        .then(res=> res.json())
                        .then(data => {
                            p.innerText = eQ
                        })
                        .catch(err=> console.log('could not update ', err))
                        // console.log(eQ, eA)
                        
                        // console.log('form submitted', e.target[1].value)
                    })

                })
                
                // this is my delete event listener
                deleteButton.addEventListener('click', ()=>{
                    fetch(`${URLQuotes}/${quote.id}`, {
                        method: 'DELETE'
                        
                    })
                    li.remove()
                })
                
                bq.append(p, footer, br, form, likeButton, deleteButton, editButton)
                li.append(bq)
                quotesContainer.append(li)
                
                


        // console.log('these are my elements', li, bq, p)

        
    }

    newQuote.addEventListener('submit', (e)=>{
        console.log('we be submitted')
        e.preventDefault()
        let quoteContent = e.target[0].value
        let quoteAuthor = e.target[1].value
        console.log('this is my event', e.target[0].value, e.target[1].value)

        fetch(URLQuotes, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "quote": quoteContent,
                "author": quoteAuthor
            })
        })
        .then(res=> res.json())
        .then(data => {
            console.log('this is my data', data)
            data.likes = []
            renderQuote(data)
        })
    })


})