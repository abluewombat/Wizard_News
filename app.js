const express = require("express");
const app = express();
const morgan = require('morgan')
const postBank = require("./postBank.js")

app.use(morgan('dev'))
app.use(express.static('public'))



app.get("/", (req,res) => {
  const posts = postBank.list()
  const response = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
  res.send(response)
})

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id){
    throw new Error('Not Found')
  }
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})</small>
            
          </p>
          <p>${post.content}</p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>
    </div>
  </body>
</html>`);
});


const {PORT = 1337} = process.env;

//error handler
app.use('/', (err, req, res, next) => {
  if (err){
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <title>Error!</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Error!</header>
        
          <div class='news-item'>
            <p>
              Sorry! the page you were looking for does not exist, or there was some kind of error.
            </p>
          </div>
      </div>
    </body>
  </html>`)
  }
})


app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
