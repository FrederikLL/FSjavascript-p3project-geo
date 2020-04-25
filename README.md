
Client:
https://expo.io/@fredll/p3project
Expo isnt allowing iOS phones, other than the app owner's, to scan QR codes or test published expo projects. It needs to be standalone deployed for it to work on others iOS' (rules from apple i suppose). It works on my personal iOS. It works on any android. 


Backend:
https://fredll.dk/
is down unless i go start it up from droplet
I wanted to put a hostname on it like p3project.fredll.dk. But i retained the same droplet from last year and i cant seem to make https work for these hostnames. The hostname is also up, but no https. 

### Explain Pros & Cons with React Native + Expo used to implement a Mobile App for Android and IOS, compared to using the Native Tools/languages for the two platforms.
 
 
 ### What is meant by the React Native Paradigm "Learn once, write anywhere" compared to for example the original (now dead) idea with Java "Write Once, run everywhere".
       
       
 ### In React Native, which parts of your code gets compiled to Native Code (Widgets) and which parts do NOT?
      
      
 ### Explain the basic building block in a React Native Application and the difference(s) between a React Application and a React Native App.
      
 ###  Explain and demonstrate ways to handle User Input in a React Native Application
 ```javascript
 <TextInput 
            style={{height:40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={text=>onChangeTextPass(text)}
            value={textValuePass}/>
            <MyButton style={{ flex: 2 }} onPressButton={()=>loginreq(textValueName,textValuePass,position.longitude,position.latitude)} 
        txt="Login with location" /> 
 ```
 Asthe textinput here is being changed, it is changing the value of a hook. We use this value in our loginreq function that is used
 when the button is pressed.
      
 ### Explain and demonstrate how to handle state in a React Native Application
      
 See question above.
      
 ### Explain and demonstrate how to communicate with external servers, in a React Native Application
 
 I communicate with my droplet using the classic fetch which returns me json.
 
 ### Explain and demonstrate ways to debug a React Native Application
 
 Shake your phone.
      
 ### Explain and demonstrate how to use Native Device Features in a React Native/Expo app.
 
 See expo docs/API reference. It shows how to use anything a phone can offer. it oftens requires an import for the code. It often requires permission from phone owner.
      
 ### Explain and demonstrate a React Native Client that uses geo-components (Location, MapView, etc.)
 
 This is the project.
      
 ### Demonstrate both server and client-side, of the geo-related parts of your implementation of the ongoing semester case.
