const { DOMParser } = require("xmldom");
const crypto = require("crypto");



function generatecsrftoken() {
  const randomString = crypto.randomBytes(16).toString("hex"); // 32-character hex string

  // Create a timestamp
  const timestamp = Date.now().toString(); // Current timestamp as a string

  // Create a hash using SHA-256
  const hash = crypto
    .createHash("sha256")
    .update(randomString + timestamp)
    .digest("hex"); // Hash of the random string and timestamp

  // Return the token in the expected format
  return `${randomString}.${hash}`;
}




module.exports={
    get_home:(req,res)=>{
       try {
         
        res.render("home")
       }
        catch (error){
            console.log("error:",error.message)
       }
        
        
       
    },
    upload_and_enhance_image: async (req, res) => {
        try {
   console.log("enter")
          CSRFtoken = generatecsrftoken();
    
          //   first Request //
    
        
    
          let formdata = new FormData();
    
          formdata.append("bucket",  "ai-direct-upload");

          formdata.append("content_type", "image/jpeg" );

    
          formdata.append("CSRFtoken", CSRFtoken);
          console.log("first_request")

    console.log("hello",formdata)
          let first_response = await fetch(
            "https://www.befunky.com/api/direct-upload/",
            {
              method: "POST",
              body: formdata,
            }
          );
      console.log(first_response)

          let data = await first_response.json();
      console.log(data)

    
          //   first Request //
          console.log("first_request")
    
          if (data.data && data.data.inputs) {
            let inputs = data.data.inputs;
            console.log("helloworld2")
    
            // second request //
    
            const imagefile = new Blob([req.file.buffer], {
              type: req.file.mimetype,
            });
    
            let formData = new FormData();
    
            formData.append("Content-Type", inputs["Content-Type"]);
            formData.append("acl", inputs.acl);
            formData.append("policy", inputs.policy);
            formData.append("success_action_status", inputs.success_action_status);
            formData.append("X-amz-credential", inputs["X-amz-credential"]);
            formData.append("X-amz-algorithm", inputs["X-amz-algorithm"]);
            formData.append("X-amz-date", inputs["X-amz-date"]);
            formData.append("X-amz-signature", inputs["X-amz-signature"]);
            formData.append("Cache-Control", inputs["Cache-Control"]);
            formData.append("key", inputs.key);
            formData.append("file", imagefile, req.file.originalname);
    
            let second_response = await fetch(
              "https://ai-direct-upload.s3-accelerate.amazonaws.com",
              {
                method: "POST",
                body: formData,
              }
            );
    
            let new_data = await second_response.text();
    
            let parse = new DOMParser();
            let xmldata = parse.parseFromString(new_data, "text/xml");
    
            const location =
              xmldata.getElementsByTagName("Location")[0].textContent;
         
        
        
    
            // second request //
    
            if (xmldata && location) {
              // Third Response //
      console.log("helloworld3")

    
              let final_formdata = new FormData();
    
              final_formdata.append("method", "api/auto-enhancer/");
              final_formdata.append("image", location);
              final_formdata.append(
                "CSRFtoken",
                "8851a006a305b1de1406ddda87ef5e2e.09d0b77598a54d5c626b5ddcc2626314ba2c530c9e485c6ac22141515bf73a4b"
              );
              final_formdata.append("model", "enhancer");
              let csrf_token =
                "CSRFtoken=8851a006a305b1de1406ddda87ef5e2e.09d0b77598a54d5c626b5ddcc2626314ba2c530c9e485c6ac22141515bf73a4b";
    
              let urlencoded = new URLSearchParams(final_formdata).toString();
    
              let final_response = await fetch(
                "https://upload.befunky.com/artsy/",
                {
                  headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-csrf-token":
                      "8851a006a305b1de1406ddda87ef5e2e.09d0b77598a54d5c626b5ddcc2626314ba2c530c9e485c6ac22141515bf73a4b",
                    cookie: csrf_token,
                  },
    
                  body: urlencoded,
                  method: "POST",
                }
              );
    
             
              let data = await final_response.json();
      
                    // Third Response //
    
              if (data.data.success) {
        
                return res.json({
                  success: true,
                  updated_img: data.data.image,
                });
              }
              else{
                return res.json({error:data.success})
              }
            }
          }
        } catch (error) {
          
          return res.status(500).json({ error: error.message });
    
       
        }
      },
    
}