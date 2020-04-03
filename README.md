
#Firebase Storage Rules:

rules_version = '2';
service firebase.storage {
  match /b/slackclone-2c815.appspot.com/o {
       
       match /avatars{
       
          match /users/{userId}{
              
              allow read:if request.auth != null;
              allow write:if request.auth != null && request.auth.uid==userId&& request.resource.contentType.matches('image/.*') && request.resource.size<1*1024*1024; 
              
              
          }
               
       }
   
   match /chat {
   match /public/{imagePath=**} {
      allow read: if request.auth!= null;
      allow write:if request.auth != null && request.resource.contentType.matches('image/.*') && request.resource.size<1*1024*1024; 

   }
   
   
   match /private/{userId1}/{userId2}/{imagePath=**}{
   
         allow read: if request.auth!= null && (request.auth.uid == userId1 || request.auth.uid== userId2) ;
         allow write: if request.auth!= null && (request.auth.uid == userId1 || request.auth.uid== userId2)&&request.resource.contentType.matches('image/.*') && request.resource.size<1*1024*1024; 
   
   }
   
   
   }
   
  }
}
