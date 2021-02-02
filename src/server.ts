import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/:filteredimage", async (req, res) => {

    let image_url = req.query.image_url;
    if ( !image_url ) {    
      return res.status(400)
        .send(`image_url is required`);    
    }

    const validateImageQuery = async (imageUrl:string) => { //from https://stackoverflow.com/questions/30970068/js-regex-url-validation/30970319 (best answer)
      var resX = imageUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      if(resX == null)
          return false;
      else
          return true;
    }
    
    try {
        var promiseB = filterImageFromURL(req.query.image_url).then(function (result) {
          res.sendFile(result, function (err) {
            if (err) {
              res.send("Error during sending of the file").end();              
            }
            else {
              var fileArray = [];
              fileArray.push(result);
              deleteLocalFiles(fileArray);
            }
          });
        }).catch(error => {
            console.log(error)
            res.send(error)
    })
    } catch (error) {
        res.send(res.status(400).json({ error: error.toString() }));             
    }
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();