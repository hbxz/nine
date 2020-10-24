## summary

1. deploy a small JSON-based web service, and provide us the URL to your solution.
2. You can take as long as you need to submit your solution. We expect fully developed and tested production quality code.

> This suggest that I shall do fully test. Let me start with unit test

## Technical requirement

1. Note: as this is also an exercise in **set-up** and **deployment**, please
   don't solve this by adding an endpoint to an existing app or service.
2. Your service should be standalone and deployed at a root path e.g. http://myservice.somedomain.com/
3. We'll post some JSON data to the URL you provide. You'll need to filter that JSON data and return a few fields.

   > check sample_request.json and sample_response.json

4. From the list of shows in the request payload, return the ones with DRM enabled (drm: true) and at least one episode (episodeCount > 0).

5. Error Handling
   On recieving invalid JSON, return a JSON response with HTTP status 400 Bad Request,
   as following
   and with a `error` key **containing** the string `Could not decode request`. For example:

   ```
   {
   "error": "Could not decode request: JSON parsing failed"
   }
   ```

6. Test the route handler

## My design

1. Using express to handle the request
2. Unit test
3. Deploy - Try to deploy the code to Lambda. If too much trouble, deploy to my EC2 and update my Domain.
