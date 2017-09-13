const express = require('express')
const jimp = require('jimp')
const fs = require('fs')
const app = express()

function display(req, res) {
    fs.readFile('views.txt', "utf8", (err, data) => {
        if (err) throw err;

        let views = parseInt(data) + 1;
        console.log("Current views: " + views);

        let blurLevel = 10 - views;
        console.log(blurLevel);

        if(blurLevel > 2) {
          fs.writeFile('views.txt', views, 'utf8', (err) => {
              if (err) throw err;
              console.log("Views file has been updated.");
          })

          jimp.read("meme.jpg").then(function (meme) {
            jimp.loadFont(jimp.FONT_SANS_32_BLACK, function(err, font) {
                meme.pixelate(blurLevel).print(font, 10, 510, "to unblur meme, refresh the page").getBuffer("image/jpeg", function(err, image){
                    res.set('Content-Type', 'image/jpeg')
                    res.send(image);
                })
            })

          }).catch(function (err) {
              console.log(err);
          })
      } else {
          res.sendFile('meme-revealed.jpg', {"root": __dirname})
      }
    })
}

app.get('/', function (req, res) {
    fs.open('views.txt', 'wx', (err, fd) => {
      if (err) {
        if (err.code === 'EEXIST') {
            display(req, res)
          return
        }
      }

      fs.writeFile('views.txt', "0", 'utf8', (err) => {
          if (err) throw err;
          console.log("Views file has been created");
          display(req, res)
      })
    });
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})