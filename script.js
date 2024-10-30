
const selection = window.getSelection();
const range = document.createRange();

function shortenURL() {
    var input = document.getElementById("urlInput").value;
    if (!input) {
        alert("Please enter a URL")
        return
    }
    document.getElementById("shortenedURL").innerHTML = '<h1>Loading...</h1>'
    fetch(`https://api.shrtco.de/v2/shorten?url=${input}`).then(response => {
        if (response.ok) {
            return response.json();
        }
        else {
            displayErrorsUsingStatusCode(response.status);
            displayShortenedURL('')
            throw new Error("Something went wrong");
        }
    }).then(data => {
        var urls = data.result;
        document.getElementById("shortenedURL").innerHTML = ''
        displayShortenedURL(urls);
    }).catch(err => console.log(err))
    document.getElementById("urlInput").value = ''

}

function displayErrorsUsingStatusCode(code) {
    var errorDiv = document.getElementById("error");
    errorDiv.innerHTML = "";
    errorDiv.style.display = 'block'
    switch (code) {
        case 400:
            errorDiv.innerHTML = "Please add a valid link";
            break;
        case 429:
            errorDiv.innerHTML = "Rate limit reached. Please try again later";
            break;
        case 500:
            errorDiv.innerHTML = "Internal server error. Please try again later";
            break;
        default:
            errorDiv.innerHTML = "Something went wrong. Please try again later";
            break;
    }

    setTimeout(() => {
        errorDiv.innerHTML = ''
        errorDiv.style.display = 'none'
    }, 1500)

}

function displayShortenedURL(shortURL) {
    var shortenedURLDiv = document.getElementById("shortenedURL");
    if (shortURL !== '') {
        shortenedURLDiv.innerHTML = `
      
        ${showLink(shortURL.full_short_link)}
        ${showLink(shortURL.full_short_link2)}
        ${showLink(shortURL.full_short_link3)}

        <div class="social_links fade-in">
        <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-512.png"
        title="share on facebook"
        onClick="shareOnFacebook('${shortURL.original_link}')"
        >
  
    
  
        <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-twitter-512.png"
        title="share on twitter"
        onClick="shareOnTwitter('${shortURL.original_link}')"
        >


        <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-linkedin-512.png"
        title="share on linkedin"
        onClick="shareOnLinkedIn('${shortURL.original_link}')"
        >
        </div>
   
    `}
    else {
        shortenedURLDiv.innerHTML = "";
    }
}

function showLink(url) {
    return `
    <div class="url-div fade-in">
        <p class="url">${url}</p>
        <div class="icons">
            <img src="https://cdn3.iconfinder.com/data/icons/ui-actions-line/16/open_in_new-new_tab-256.png" 
            title="view in new tab" 
            onClick="openInNewTab('${url}')"
        >
            <img src="http://clipground.com/images/copy-4.png" 
            title="Click to Copy"
            onClick="copyToClipboard('${url}')"
        >
           
        </div>
     </div>   
    `
}

function openInNewTab(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }
    window.open(url, '_blank');
}

function copyToClipboard(text) {
    //copy text to clipboard
    let node = document.createElement('textarea')
    node.value = text
    node.select()
    document.getElementById('shortenedURL').appendChild(node)
    node.setSelectionRange(0, 99999);
    const successful = document.execCommand('copy');

    if(successful){
        alert('Test Copied!');
      } else {
        alert('Unable to copy!');  
      }
      document.getElementById('shortenedURL').removeChild(node)
    // console.log(navigator.userAgent)
    // navigator.clipboard.writeText(text).then(function () {
    //     alert("Copied to clipboard");
    // }
    //     , function (err) {
    //         console.error('Async: Could not copy text: ', err);
    //     }
    // );
}

function shareOnFacebook(content) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content)}`, '_blank');
}
function shareOnTwitter(content) {
    window.open(`https://twitter.com/share?url=${encodeURIComponent(content)}`, '_blank');
}
function shareOnLinkedIn(content) {
    window.open(`http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(content)}`, '_blank');
}
