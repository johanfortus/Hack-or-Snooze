let storySection = document.querySelector('.storiesList')

// Inputs
let loginForm = document.querySelector('.loginForm')
let usernameInput = document.querySelector('.usernameInput');
let passwordInput = document.querySelector('.passwordInput');

// Nav bar buttons
let $brand = $('.brand')
let $submitButton = $('.submitButton')
let $favoritesButton = $('.favoritesButton')
let $storiesButton = $('.storiesButton')
let $loginButton = $('.loginButton')
let $logoutButton = $('.logoutButton')
let $userProfileButton = $('.userProfileButton')

// forms
let $loginForm = $('.loginForm')
let $signUpForm = $('.signUpForm')
let $createAccountForm = $('.createAccountForm')
let $createStoryForm = $('.createStoryForm')

// sections
let $userSection = $('.userSection')
let $storySection = $('.storySection')
let $userFavoriteSection = $('.userFavoriteSection')
let $userStoriesSection = $('.userStoriesSection')
let userStoriesSection = $('.userStoriesSection')
let $userInfoSection = $('.userInfoSection')

let $storyList = $('.storiesList')

let $starButton = $('.starButton')

// STORY LIST
async function storyList(){
    let res = await axios.get('https://hack-or-snooze-v3.herokuapp.com/stories')
    let storiesList = res.data.stories
    // console.log(storiesList)
    for(let stories of storiesList){
        // console.log(stories)
        let storyID = stories.storyId
        let li = document.createElement('li')
        li.innerHTML = `<span class='starButton ${storyID} star'></span> <b><a href=${stories.url} class="${storyID}" target="_blank">${stories.title}</a></b> <span class="storyURL">(${storyHostName(stories.url)})</span> by ${stories.author}`
        storySection.append(li)
    }

        // Favoriting a Story Functionality
        let $starButton = $('.starButton')
        $starButton.on('click', async function(e){
            if(localStorage.getItem('Username') === null){
                $storySection.hide()
                $userFavoriteSection.hide()
                $loginForm.show()
                $signUpForm.show()
                let timer = setTimeout(function(){
                    alert('Login or create an account to favorite!')
                }, 50)
            }
            else{
                console.log(e.target.classList[1])
                let storyID = e.target.classList[1]
                
                if(e.target.classList[2] === 'star'){
                    e.target.classList.remove('star')
                    e.target.classList.add('favorited')
                    let token = localStorage.getItem('token')
                    let res = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}/favorites/${storyID}`, localStorage.getItem('Username'), { params: { token } })
                    console.log(res)
                }
        
                else{
                    e.target.classList.remove('favorited')
                    e.target.classList.add('star')
                    let token = localStorage.getItem('token')
                    let username = localStorage.getItem('Username')
                    let res = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${username}/favorites/${storyID}`, { params: { token } })
                    console.log(res)
                }
            }
            }
        )
        ifFavorited()
}

// Automatically favorites any story on page that is already on user's favorited list
async function ifFavorited(){
    let arr = []
    let token = localStorage.getItem('token')
    let res = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}`, { params: { token } })
    let userFavoriteList = res.data.user.favorites
    for(let favorites of userFavoriteList){
        arr.push(favorites.storyId.toString())
    }

   for(let stories of $storyList.children()){
    if(arr.includes(stories.firstChild.classList[1])){
        stories.firstChild.classList.remove('star')
        stories.firstChild.classList.add('favorited')
    }   
   }         
}


// Sign Up Function
async function signUp(username, password, name){
    try{
        let res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/signup', { user: {name, username, password}})
        console.log(res)
        login(username, password)
    }
    catch{
        alert('Username has been taken')
    }
}
$createAccountForm.on('submit', async function(e){
    e.preventDefault()
    let nameInput = document.querySelector('.creatingNameInput')
    let usernameInput = document.querySelector('.creatingUsernameInput')
    let passwordInput = document.querySelector('.creatingPasswordInput')
    let name = nameInput.value
    let username = usernameInput.value
    let password = passwordInput.value

    signUp(username, password, name)
})


// Login Function
async function login(username, password){
    try{
        let res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/login', { user: {username, password} } )
        console.log(res.data.token)
        localStorage.setItem('Username', username)
        localStorage.setItem('Password', password);
        localStorage.setItem('token', res.data.token)

        // page changed when logged in
        $storySection.show()
        $loginForm.hide()
        $signUpForm.hide()
        $loginButton.hide()
        $userProfileButton.text(localStorage.getItem('Username'))
        $logoutButton.text('(logout)')

        $submitButton.show()
        $favoritesButton.show()
        $storiesButton.show()

        $userSection.show()
        $userProfileButton.show()
        $logoutButton.show()
        ifFavorited()
        return res.data.token
    }
    catch{
        alert('Incorrect username or password')
    }
}



// Login Current User Function
async function currentUserLogin(username, password){
    try{
        let res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/login', { user: {username, password} } )
        // console.log(res.data.token)
        $userProfileButton.text(`${localStorage.getItem('Username')}`)
        $storySection.show()
        $loginForm.hide()
        $signUpForm.hide()
        $loginButton.hide()
        
        $logoutButton.text('(logout)')
        
        $userSection.show()
    
        $submitButton.show()
        $favoritesButton.show()
        $storiesButton.show()

        $userProfileButton.show()
        $logoutButton.show()

        return res.data.token
    }
    catch(e){
        console.log(e)
    }
}



// logging in user
loginForm.addEventListener('submit', function(e){
    e.preventDefault()
    console.log(usernameInput.value)
    let username = usernameInput.value
    let password = passwordInput.value

    login(username, password)
})


// API FUNCTIONALITY REFERENCE
async function getUsers(token){
    let res = await axios.get('https://hack-or-snooze-v3.herokuapp.com/users/', { params: { token } });
    console.log(res)
}
async function getUsersWithAuth(){
    const token = await login('lolboi', 'lolboi');
    getUsers(token)
}


NAV: 
// STORY HOST NAME
function storyHostName(str){
    let total = 0;
    let newArr = [];
    let arr = str.split('');
    for(let i = 0; i <= arr.length ; i++){
        if(arr[i] === '/'){
            total+=1;
        }
        if(total <= 2){
            newArr.push(arr[i])
        }
    }
    return newArr.join('')
}



// NAV: Clicking on Hack or Snooze logo
$brand.on('click', function(){
    $storyList.empty()
    storyList()

    $userFavoriteSection.hide()
    $userStoryContainer.empty()
    $storySection.show()
    $loginForm.hide()
    $signUpForm.hide()
    $createStoryForm.hide()
    $userInfoSection.hide()
    $userStoriesSection.hide()

})

// NAV: Clicking on Login/Signup Button
$loginButton.on('click', function(){
    $storySection.hide()
    $userFavoriteSection.hide()
    $loginForm.show()
    $signUpForm.show()
})

// NAV: Clicking on Username
$userProfileButton.on('click', function(){
    $userStoryContainer.empty()
    $userFavoriteSection.hide()
    $storySection.hide()
    $createStoryForm.hide()
    $userStoriesSection.hide()
    $userInfoSection.show()
    
    async function getUser(){
        let token = localStorage.getItem('token')
        let res = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}`, { params: { token } })
        // console.log('user: ', res)
        // console.log('name:', res.data.user.name)
        // console.log('username:', res.data.user.username)

        const dateDraft = res.data.user.createdAt
        let dateArr = dateDraft.split('')
        for(let i = 0; i <= 13; i++){
            dateArr.pop()
        }
        let dateFinal = dateArr.join('')

        // console.log('date created:', dateFinal)

        let userInfoContainer = document.querySelector('.userInfoContainer')
        let liOne = document.querySelector('.liOne')
        let liTwo = document.querySelector('.liTwo')
        let liThree = document.querySelector('.liThree')

        liOne.innerText = 'Name: ' + res.data.user.name
        liTwo.innerText = 'Username: ' + res.data.user.username
        liThree.innerText = 'Date Created: ' + dateFinal


    }
    getUser()
})


// NAV: Clicking Logout 
function logout(evt) {
    console.debug("logout", evt);
    localStorage.clear();
    location.reload();
  }
$logoutButton.on('click', logout)


// NAV: Clicking on Submit 
$submitButton.on('click', function(){
    $storyList.empty()
    storyList()

    $userStoryContainer.empty()
    $createStoryForm.show()
    $storySection.show()
    $userInfoSection.hide()
    $userStoriesSection.hide()
    $userFavoriteSection.hide()
})

// NAV: Clicking on Favorites Page
let $userFavoriteContainer = $('.userFavoriteContainer')
$favoritesButton.on('click', async function(){
    $userFavoriteContainer.empty()
    $storySection.hide()
    $createStoryForm.hide()
    $userStoriesSection.hide()
    $userInfoSection.hide()
    $userFavoriteSection.show()

    let token = localStorage.getItem('token')
    let res = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}`, { params: { token } })
    let userFavoriteList = res.data.user.favorites

    let defaultUserStory = document.createElement('li')
    defaultUserStory.innerText = 'No Favorites added by user yet!'
    console.log(userFavoriteList)

    if(userFavoriteList.length === 0){
        $userFavoriteContainer.append(defaultUserStory)
    }
    else{
        for(let stories of userFavoriteList){
            console.log(stories)
            let li = document.createElement('li')
            let storyID = stories.storyId
            li.innerHTML = `<span class='starButton ${storyID} favorited'></span> <b><a href=${stories.url} class="${storyID}" target="_blank">${stories.title}</a></b> <span class="storyURL">(${storyHostName(stories.url)})</span> by ${stories.author}`
            $userFavoriteContainer.append(li)
        }
    }
    // Favorite Functionality inside Favorites page
    let $starButton = $('.starButton')
    $starButton.on('click', async function(e){
        console.log(e.target.classList[1])
        let storyID = e.target.classList[1]

        if(e.target.classList[2] === 'star'){
            e.target.classList.remove('star')
            e.target.classList.add('favorited')
            let token = localStorage.getItem('token')
            let res = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}/favorites/${storyID}`, localStorage.getItem('Username'), { params: { token } })
            // console.log(res)
        }
        else{
            e.target.classList.remove('favorited')
            e.target.classList.add('star')
            let token = localStorage.getItem('token')
            let username = localStorage.getItem('Username')
            let res = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${username}/favorites/${storyID}`, { params: { token } })
            e.target.parentNode.remove()
            // console.log(res)

            if($userFavoriteContainer.children().length === 0){
                let defaultUserStory = document.createElement('li')
                defaultUserStory.innerText = 'No stories added by user yet!'
                $userFavoriteContainer.append(defaultUserStory)
            }

        }
    })

})





// NAV: Clicking on My Stories Page
let $userStoryContainer = $('.userStoryContainer')
let $defaultUserStory = $('.defaultUserStory')
$storiesButton.on('click', async function(){
    $userStoryContainer.empty()
    $storySection.hide()
    $createStoryForm.hide()
    $userStoriesSection.hide()
    $userInfoSection.hide()
    $userFavoriteSection.hide()
    $userStoriesSection.show()
    
    let token = localStorage.getItem('token')
    let res = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}`, { params: { token } })
    let userStoriesList = res.data.user.stories
    console.log(userStoriesList.length === 0)

    let defaultUserStory = document.createElement('li')
    defaultUserStory.innerText = 'No stories added by user yet!'
    if(userStoriesList.length === 0){
        $userStoryContainer.append(defaultUserStory)
    }
    else{
        for(let stories of userStoriesList){
            console.log(stories)
            let li = document.createElement('li')
            let storyID = stories.storyId
            li.innerHTML = `<img src="assets/trash.png" class="deleteButton" alt="" height="15px">  <span class='starButton ${storyID} star'></span> <b><a href=${stories.url} class="${storyID}" target="_blank">${stories.title}</a></b> <span class="storyURL">(${storyHostName(stories.url)})</span> by ${stories.author}`
            $userStoryContainer.append(li)
        }
    }
    
    let arr = [] // Automatically favorites any story in story page if stories are in user's favorited page
    let userFavoriteList = res.data.user.favorites
    for(let favorites of userFavoriteList){
        arr.push(favorites.storyId.toString())
    }
    for(let stories of $userStoryContainer.children()){
        if(arr.includes(stories.firstChild.nextElementSibling.classList[1])){
            stories.firstChild.nextElementSibling.classList.remove('star')
            stories.firstChild.nextElementSibling.classList.add('favorited')
        }   
       } 

    let $deleteButton = $('.deleteButton') // delete story functionality
    $deleteButton.on('click', async function(e){
        console.log(e.target.parentNode.children[2].children[0].classList.value)
        let token = localStorage.getItem('token')
        let storyID = e.target.parentNode.children[2].children[0].classList.value
        await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyID}`, { params: { token } })
        e.target.parentNode.remove()

        if($userStoryContainer.children().length === 0){
            let defaultUserStory = document.createElement('li')
            defaultUserStory.innerText = 'No stories added by user yet!'
            $userStoryContainer.append(defaultUserStory)
        }
    })
    
    let $starButton = $('.starButton') // favorite story functionality in user's story page
    $starButton.on('click', async function(e){
        console.log(e.target.classList[1])
        let storyID = e.target.classList[1]
        if(e.target.classList[2] === 'star'){
            e.target.classList.remove('star')
            e.target.classList.add('favorited')
            let token = localStorage.getItem('token')
            let res = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${localStorage.getItem('Username')}/favorites/${storyID}`, localStorage.getItem('Username'), { params: { token } })
            console.log(res)
        }
        else{
            e.target.classList.remove('favorited')
            e.target.classList.add('star')
            let token = localStorage.getItem('token')
            let username = localStorage.getItem('Username')
            let res = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${username}/favorites/${storyID}`, { params: { token } })
            console.log(res)
        }
        
    })
})




// CREATE STORY FUNCTION
async function createStory(author, title, url, li, ul, authorInput, titleInput, urlInput){
    try{
        const token = await login(localStorage.getItem("Username"), localStorage.getItem("Password"));
        const newStory = {
            token,  
            story: {
                author: `${author}`,
                title: `${title}`,
                url: `${url}`
            } 
            // story: {
            //     author: 'lolboi',
            //     title: 'TEST!',
            //     url: 'https://google.com/'
            // } 
        }
        const res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/stories', newStory);
        
        let newStoryID = res.data.story.storyId
        $createStoryForm.hide()
        li.innerHTML = `<span class='starButton ${newStoryID} star'></span> <b><a href=${url} class="" target="_blank">${title}</a></b> <span class="storyURL">(${storyHostName(url)})</span> by ${author}`
        ul.prepend(li)
        authorInput.value = ''
        titleInput.value = ''
        urlInput.value = ''

    }
    catch(e){
        alert('Add a valid URL')
        console.log(e)
    }
}
$createStoryForm.on('submit', function(e){
    e.preventDefault()

    let authorInput = document.querySelector('.authorInput')
    let titleInput = document.querySelector('.titleInput')
    let urlInput = document.querySelector('.urlInput')
    let ul = document.querySelector('.storiesList')
    let li = document.createElement('li')

    let author = authorInput.value
    let title = titleInput.value
    let url = urlInput.value
    createStory(author, title, url, li, ul, authorInput, titleInput, urlInput)
})


// logging in current user
currentUserLogin(localStorage.getItem("Username"), localStorage.getItem("Password"))


// Page Defaults
$userStoryContainer.empty()
$submitButton.hide()
$favoritesButton.hide()
$storiesButton.hide()

$loginForm.hide()
$createStoryForm.hide()
$signUpForm.hide()
$logoutButton.hide()
$userSection.hide()
$userFavoriteSection.hide()
$userStoriesSection.hide()
$userInfoSection.hide()


$userProfileButton.hide()



$loginButton.show()
storyList()
